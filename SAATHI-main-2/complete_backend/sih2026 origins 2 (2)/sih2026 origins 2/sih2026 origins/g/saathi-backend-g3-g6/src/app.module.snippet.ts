/**
 * NOT a real app.module.ts — this repo has no bootstrap file on purpose,
 * since it's meant to be merged into the existing NestJS backend, not run
 * standalone. Copy the relevant imports into the real AppModule instead of
 * copying this file wholesale.
 *
 *   @Module({
 *     imports: [
 *       // ...existing imports (D1Module, D4Module, M1Module, etc.)
 *       TestimonialsModule,
 *       PasswordResetModule,
 *       EmailModule,
 *       NotificationsModule,
 *     ],
 *   })
 *   export class AppModule {}
 *
 * Also required once, at the root, if not already present elsewhere in the
 * backend (M1's ingestion queue likely already registers most of these):
 *
 *   BullModule.forRoot({ connection: { host: REDIS_HOST, port: REDIS_PORT } })
 *   EventEmitterModule.forRoot()
 *   TypeOrmModule.forRoot({ ...DB config... })
 *   ConfigModule.forRoot({ isGlobal: true })
 */
export {};
