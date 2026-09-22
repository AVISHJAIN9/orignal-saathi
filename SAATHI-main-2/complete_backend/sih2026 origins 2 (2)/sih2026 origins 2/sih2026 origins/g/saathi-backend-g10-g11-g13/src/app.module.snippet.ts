/**
 * NOT a real app.module.ts — same convention as the G3-G6 delivery. Copy
 * the relevant imports into the real AppModule.
 *
 *   @Module({
 *     imports: [
 *       // ...existing imports (D1Module, D4Module, TestimonialsModule, etc.)
 *       CaptchaModule,
 *       TwoFactorModule,
 *       SitemapModule,
 *     ],
 *   })
 *   export class AppModule {}
 *
 * Root-level requirement if not already present (EventEmitterModule is
 * needed for G13's cache invalidation — G6 from the previous delivery
 * already requires it too, so this is likely already registered):
 *
 *   EventEmitterModule.forRoot()
 *   ConfigModule.forRoot({ isGlobal: true })
 *
 * P1's login controller needs one direct call added (not a module import
 * of anything HTTP-facing):
 *
 *   constructor(private readonly twoFactor: TwoFactorService) {}
 *   // after password check succeeds:
 *   const { enabled } = await this.twoFactor.status(user.id);
 *   if (enabled) {
 *     const ok = await this.twoFactor.verifyLoginCode(user.id, dto.otpCode);
 *     if (!ok) throw new UnauthorizedException('Invalid 2FA code.');
 *   }
 */
export {};
