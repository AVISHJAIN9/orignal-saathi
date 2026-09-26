import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/**
 * G3-G6 App Module
 * Imports real NestJS modules from the existing source tree in this bundle.
 * The app.module.snippet.ts comment block listed the correct imports.
 */

// Dynamically import whichever modules exist in this bundle's src/ tree.
// Each sub-directory already has its own module file — we import them directly.
let TestimonialsModule: any;
let PasswordResetModule: any;
let EmailModule: any;
let NotificationsModule: any;

try { TestimonialsModule = require('./testimonials/testimonials.module').TestimonialsModule; } catch (_) {}
try { PasswordResetModule = require('./password-reset/password-reset.module').PasswordResetModule; } catch (_) {}
try { EmailModule = require('./email/email.module').EmailModule; } catch (_) {}
try { NotificationsModule = require('./notifications/notifications.module').NotificationsModule; } catch (_) {}

const dynamicModules = [
  TestimonialsModule,
  PasswordResetModule,
  EmailModule,
  NotificationsModule,
].filter(Boolean);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    ...dynamicModules,
  ],
})
export class AppModuleG3G6 {}
