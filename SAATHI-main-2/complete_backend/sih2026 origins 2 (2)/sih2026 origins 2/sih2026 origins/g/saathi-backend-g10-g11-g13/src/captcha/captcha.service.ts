import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CAPTCHA_PROVIDER, CaptchaProvider } from './captcha-provider.interface';

export interface IsHumanOptions {
  remoteIp?: string;
  /**
   * Expected reCAPTCHA v3 action name (set client-side via
   * grecaptcha.execute(key, {action: '...'})). When provided and the
   * provider returns a different action than expected, verification fails
   * — this stops a token minted for one form being replayed against a
   * different, possibly more sensitive, endpoint. Ignored for providers
   * that don't return an action (hCaptcha).
   */
  expectedAction?: string;
}

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);

  constructor(
    @Inject(CAPTCHA_PROVIDER) private readonly provider: CaptchaProvider,
    private readonly config: ConfigService,
    // Optional: this module works without EventEmitterModule.forRoot()
    // registered, it just skips telemetry in that case.
    @Optional() private readonly events?: EventEmitter2,
  ) {}

  async isHuman(token: string, options: IsHumanOptions = {}): Promise<boolean> {
    if (!token) {
      this.emitFailure('missing-token');
      return false;
    }

    const result = await this.provider.verify(token, options.remoteIp);
    if (!result.success) {
      const reason = (result.errorCodes ?? []).join(', ') || 'unknown';
      this.logger.warn(`Captcha rejected: ${reason}`);
      this.emitFailure(reason);
      // Only an infrastructure failure (we couldn't reach/read the
      // provider) is eligible for fail-open. A genuine "no" from the
      // provider is never overridden by this setting.
      return result.infrastructureError ? this.failOpenEnabled() : false;
    }

    // Only reCAPTCHA v3 returns a score; hCaptcha's success flag is already
    // the final answer.
    if (typeof result.score === 'number') {
      const minScore = this.config.get<number>('RECAPTCHA_MIN_SCORE', 0.5);
      if (result.score < minScore) {
        this.logger.warn(`Captcha score ${result.score} below threshold ${minScore}`);
        this.emitFailure('score-below-threshold');
        return false;
      }
    }

    // Action check: only meaningful when the provider returned one AND the
    // caller told us what it expected.
    if (options.expectedAction && result.action && result.action !== options.expectedAction) {
      this.logger.warn(`Captcha action mismatch: expected "${options.expectedAction}", got "${result.action}"`);
      this.emitFailure('action-mismatch');
      return false;
    }

    return true;
  }

  /**
   * CAPTCHA_FAIL_OPEN controls behavior ONLY when we couldn't reach or read
   * the provider (network error, timeout, missing secret) — never for a
   * genuine negative verdict. Default is fail-closed (safer — a provider
   * outage blocks the gated action entirely). Flip to fail-open only with a
   * clear understanding that it trades bot-blocking for availability during
   * a provider outage.
   */
  private failOpenEnabled(): boolean {
    return this.config.get<string>('CAPTCHA_FAIL_OPEN', 'false') === 'true';
  }

  private emitFailure(reason: string): void {
    this.events?.emit('captcha.verification.failed', { reason, at: new Date().toISOString() });
  }
}
