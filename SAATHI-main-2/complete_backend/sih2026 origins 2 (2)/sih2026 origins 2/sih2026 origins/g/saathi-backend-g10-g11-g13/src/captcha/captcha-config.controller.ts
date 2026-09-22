import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Site keys (unlike secret keys) are public by design — reCAPTCHA/hCaptcha
 * widgets embed them client-side regardless. Serving them from here means
 * the frontend doesn't hardcode a provider choice that can drift from
 * CAPTCHA_PROVIDER, and switching providers is a backend env change only.
 */
@Controller('captcha')
export class CaptchaConfigController {
  constructor(private readonly config: ConfigService) {}

  @Get('config')
  getConfig(): { provider: string; siteKey: string | null } {
    const provider = this.config.get<string>('CAPTCHA_PROVIDER', 'recaptcha_v3');
    const siteKey =
      provider === 'hcaptcha'
        ? this.config.get<string>('HCAPTCHA_SITE_KEY', null)
        : this.config.get<string>('RECAPTCHA_SITE_KEY', null);

    return { provider, siteKey };
  }
}
