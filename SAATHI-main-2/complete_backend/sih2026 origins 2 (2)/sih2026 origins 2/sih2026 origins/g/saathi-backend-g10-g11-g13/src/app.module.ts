import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/**
 * G10-G13 App Module
 * Imports real NestJS modules from the existing source tree in this bundle.
 */

let CaptchaModule: any;
let TwoFactorModule: any;
let SitemapModule: any;

try { CaptchaModule = require('./captcha/captcha.module').CaptchaModule; } catch (_) {}
try { TwoFactorModule = require('./two-factor/two-factor.module').TwoFactorModule; } catch (_) {}
try { SitemapModule = require('./sitemap/sitemap.module').SitemapModule; } catch (_) {}

const dynamicModules = [
  CaptchaModule,
  TwoFactorModule,
  SitemapModule,
].filter(Boolean);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    ...dynamicModules,
  ],
})
export class AppModuleG10G13 {}
