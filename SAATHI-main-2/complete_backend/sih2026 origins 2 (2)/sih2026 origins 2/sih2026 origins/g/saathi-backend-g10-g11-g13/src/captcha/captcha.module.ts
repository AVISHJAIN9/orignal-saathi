import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CAPTCHA_PROVIDER } from './captcha-provider.interface';
import { RecaptchaV3Provider } from './recaptcha-v3.provider';
import { HcaptchaProvider } from './hcaptcha.provider';
import { CaptchaService } from './captcha.service';
import { CaptchaGuard } from './captcha.guard';
import { CaptchaConfigController } from './captcha-config.controller';

const captchaProviderFactory: Provider = {
  provide: CAPTCHA_PROVIDER,
  inject: [ConfigService, RecaptchaV3Provider, HcaptchaProvider],
  useFactory: (config: ConfigService, recaptcha: RecaptchaV3Provider, hcaptcha: HcaptchaProvider) =>
    config.get<string>('CAPTCHA_PROVIDER', 'recaptcha_v3') === 'hcaptcha' ? hcaptcha : recaptcha,
};

@Module({
  imports: [ConfigModule],
  controllers: [CaptchaConfigController],
  providers: [RecaptchaV3Provider, HcaptchaProvider, captchaProviderFactory, CaptchaService, CaptchaGuard],
  // CaptchaGuard is exported so D1/X6's modules can import CaptchaModule and
  // apply @UseGuards(CaptchaGuard) without redefining it.
  exports: [CaptchaService, CaptchaGuard],
})
export class CaptchaModule {}
