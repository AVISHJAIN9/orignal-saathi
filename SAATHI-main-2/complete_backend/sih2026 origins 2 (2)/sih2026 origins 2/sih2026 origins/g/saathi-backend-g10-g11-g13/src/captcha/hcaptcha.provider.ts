import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CaptchaProvider, CaptchaVerification } from './captcha-provider.interface';

const VERIFY_URL = 'https://hcaptcha.com/siteverify';
const VERIFY_TIMEOUT_MS = 5_000;

interface HcaptchaVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/**
 * Alternate to RecaptchaV3Provider — switch CAPTCHA_PROVIDER=hcaptcha in env
 * if the team prefers hCaptcha's stricter EU-hosted / no-tracking posture
 * over reCAPTCHA. hCaptcha has no score, only a binary pass/fail.
 */
@Injectable()
export class HcaptchaProvider implements CaptchaProvider {
  private readonly logger = new Logger(HcaptchaProvider.name);

  constructor(private readonly config: ConfigService) {}

  async verify(token: string, remoteIp?: string): Promise<CaptchaVerification> {
    const secret = this.config.get<string>('HCAPTCHA_SECRET_KEY');
    if (!secret) {
      this.logger.error('HCAPTCHA_SECRET_KEY is not set; rejecting captcha verification.');
      return { success: false, errorCodes: ['missing-server-secret'], infrastructureError: true };
    }

    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.set('remoteip', remoteIp);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    try {
      const res = await fetch(VERIFY_URL, {
        method: 'POST',
        body: params,
        signal: controller.signal,
      });
      const data = (await res.json()) as HcaptchaVerifyResponse;
      return { success: data.success ?? false, errorCodes: data['error-codes'] };
    } catch (err) {
      const timedOut = err instanceof Error && err.name === 'AbortError';
      const message = timedOut ? `timed out after ${VERIFY_TIMEOUT_MS}ms` : err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`hCaptcha verification request failed: ${message}`);
      return {
        success: false,
        errorCodes: [timedOut ? 'verification-request-timeout' : 'verification-request-failed'],
        infrastructureError: true,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
