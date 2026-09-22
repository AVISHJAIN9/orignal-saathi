/**
 * hCaptcha Guard — Server-Side Verification
 *
 * Validates hCaptcha tokens before allowing access to high-risk endpoints:
 * - /api/v1/auth/register
 * - /api/v1/auth/login (on repeated failures)
 * - /api/v1/chat (first message in new session)
 * - WhatsApp opt-in
 *
 * Usage:
 *   @UseGuards(HCaptchaGuard)
 *   @Post('register')
 *
 * The client must send the hCaptcha token in the request body:
 *   { "hcaptchaToken": "10000000-aaaa-bbbb-cccc-000000000001" }
 *
 * HCAPTCHA_SECRET_KEY must be set in environment / Secrets Manager.
 * Use hCaptcha's test key (10000000-ffff-ffff-ffff-000000000001) in LOCAL_DEV.
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import * as https from 'https';
import * as querystring from 'querystring';

export const SKIP_CAPTCHA_KEY = 'skipCaptcha';

/** Decorator to skip captcha check on specific routes (e.g. health checks) */
export function SkipCaptcha() {
  const { SetMetadata } = require('@nestjs/common');
  return SetMetadata(SKIP_CAPTCHA_KEY, true);
}

@Injectable()
export class HCaptchaGuard implements CanActivate {
  private readonly logger = new Logger(HCaptchaGuard.name);
  private readonly secretKey: string;
  private readonly siteKey: string;
  private readonly isProduction: boolean;
  private readonly verifyUrl = 'https://api.hcaptcha.com/siteverify';

  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.secretKey = config.get<string>('HCAPTCHA_SECRET_KEY', '');
    this.siteKey = config.get<string>('HCAPTCHA_SITE_KEY', '');
    this.isProduction = config.get<string>('NODE_ENV') === 'production';

    if (this.isProduction && !this.secretKey) {
      throw new Error(
        'HCAPTCHA_SECRET_KEY not set. hCaptcha is required in production. ' +
        'Get your secret key at https://dashboard.hcaptcha.com/',
      );
    }

    if (!this.isProduction && !this.secretKey) {
      this.logger.warn(
        '[LOCAL-DEV] HCAPTCHA_SECRET_KEY not set. ' +
        'Using hCaptcha test mode — all tokens will be accepted. ' +
        'Set HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000 for local testing.',
      );
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow @SkipCaptcha() decorated routes
    const skipCaptcha = this.reflector.getAllAndOverride<boolean>(
      SKIP_CAPTCHA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skipCaptcha) return true;

    const request = context.switchToHttp().getRequest();
    const token: string | undefined =
      request.body?.hcaptchaToken ||
      request.headers?.['x-hcaptcha-token'];

    // In LOCAL_DEV without a key: log warning and pass
    if (!this.isProduction && !this.secretKey) {
      this.logger.warn(
        `[LOCAL-DEV] hCaptcha skipped for ${request.method} ${request.url}. Set HCAPTCHA_SECRET_KEY to enable.`,
      );
      return true;
    }

    if (!token) {
      throw new UnauthorizedException(
        'hCaptcha token missing. Include "hcaptchaToken" in your request body.',
      );
    }

    const valid = await this.verify(token, request.ip);
    if (!valid) {
      this.logger.warn(
        `hCaptcha verification FAILED for ${request.method} ${request.url} from ${request.ip}`,
      );
      throw new UnauthorizedException(
        'hCaptcha verification failed. Please complete the CAPTCHA challenge.',
      );
    }

    return true;
  }

  private verify(token: string, remoteIp?: string): Promise<boolean> {
    return new Promise((resolve) => {
      const postData = querystring.stringify({
        secret: this.secretKey,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
        ...(this.siteKey ? { sitekey: this.siteKey } : {}),
      });

      const options = {
        hostname: 'api.hcaptcha.com',
        path: '/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 5000,
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (!result.success) {
              this.logger.debug(`hCaptcha rejection codes: ${result['error-codes']?.join(', ')}`);
            }
            resolve(result.success === true);
          } catch {
            resolve(false);
          }
        });
      });

      req.on('error', (err) => {
        this.logger.error(`hCaptcha API request failed: ${err.message}`);
        // Fail OPEN on API error in non-production to avoid blocking users
        // Fail CLOSED in production
        resolve(!this.isProduction);
      });

      req.on('timeout', () => {
        req.destroy();
        this.logger.error('hCaptcha API timeout (5s)');
        resolve(!this.isProduction);
      });

      req.write(postData);
      req.end();
    });
  }
}
