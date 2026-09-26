import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CaptchaProvider, CaptchaVerification } from './captcha-provider.interface';

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const VERIFY_TIMEOUT_MS = 5_000;

interface GoogleSiteverifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

@Injectable()
export class RecaptchaV3Provider implements CaptchaProvider {
  private readonly logger = new Logger(RecaptchaV3Provider.name);

  constructor(private readonly config: ConfigService) {}

  async verify(token: string, remoteIp?: string): Promise<CaptchaVerification> {
    const secret = this.config.get<string>('RECAPTCHA_SECRET_KEY');
    if (!secret) {
      // Fail closed in production, but log loudly — a missing secret should
      // never silently let every request through.
      this.logger.error('RECAPTCHA_SECRET_KEY is not set; rejecting captcha verification.');
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
      const data = (await res.json()) as GoogleSiteverifyResponse;

      return {
        success: data.success ?? false,
        score: data.score,
        action: data.action,
        errorCodes: data['error-codes'],
      };
    } catch (err) {
      const timedOut = err instanceof Error && err.name === 'AbortError';
      const message = timedOut ? `timed out after ${VERIFY_TIMEOUT_MS}ms` : err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`reCAPTCHA verification request failed: ${message}`);
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
