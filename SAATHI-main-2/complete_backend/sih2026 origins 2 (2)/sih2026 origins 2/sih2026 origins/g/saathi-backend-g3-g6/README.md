# SAATHI backend — G3, G4, G5, G6

Backend-only implementation of four Website Essentials Checklist items from
the SIH26107 build spec. **NestJS + TypeORM + Postgres + BullMQ/Redis**,
matching the stack you used for D4. This is not a standalone app — no
`main.ts`/bootstrap file is included on purpose. Drop `src/` into the real
backend repo, merge `package.json`'s dependencies, and register the four
modules per `src/app.module.snippet.ts`.

## What's in here, by spec ID

| ID | Feature | What's implemented |
|----|---------|---------------------|
| **G3** | Testimonials / Reviews Page | `Testimonial` entity; public `GET /testimonials` (approved-only); admin `GET /testimonials/admin`, `POST`, `PATCH` (also doubles as approve/reject), `DELETE`, all behind `JwtAuthGuard` + `RolesGuard(ADMIN)`. |
| **G4** | Password Reset / Recovery | `PasswordResetToken` entity (SHA-256 token hash, 30-min TTL); `POST /auth/password-reset/request` and `/confirm`. Email-enumeration-safe (identical response whether or not the account exists). Depends on `UsersPort` — see Integration below. |
| **G5** | Transactional Email Engine | `EmailLog` entity; BullMQ queue (`email-dispatch`) + processor sending via nodemailer/SMTP; three templates (password reset, escalation ticket confirmation, admin ingestion-failure alert); 3 retries with exponential backoff. |
| **G6** | In-App Notification Center | `Notification` entity; cursor-paginated `GET /notifications` (same shape as your D4 conversation-history endpoint), `GET /notifications/unread-count`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`; event-listener bridge for X3/M9 to feed notifications without a direct import. |

## Integration points — read before merging

These four features touch other people's work. Rather than importing their
code directly (which would make this module fail to compile until their
code exists, and break silently if they rename something), each dependency
is behind a narrow interface:

1. **G4 → P1 (Auth)**: `PasswordResetService` depends on `UsersPort`
   (`src/common/ports/users.port.ts`) — `findByEmail`, `findById`,
   `updatePasswordHash`. `password-reset.module.ts` currently binds this to
   `InMemoryUsersPort`, a placeholder that forgets everything on restart.
   **Before this goes anywhere near production**, whoever owns P1 needs to
   write a real adapter against the actual Credentials/User entity and swap
   the provider in `password-reset.module.ts`:
   ```ts
   { provide: USERS_PORT, useClass: TypeOrmUsersAdapter }
   ```

2. **All four → P1 (Auth)**: `JwtAuthGuard` wraps `AuthGuard('jwt')`,
   assuming P1 registers a Passport strategy literally named `'jwt'`. If
   it's named differently, change one string in
   `src/common/auth/jwt-auth.guard.ts` — nothing else needs to change.
   `RolesGuard` reads `request.user.role`; make sure P1's strategy actually
   attaches a `role` field matching `Role.ADMIN` / `Role.PUBLIC`.

3. **G6 → X3 (Escalation) and M9 (Session Management)**: notifications are
   created by listening for `escalation.ticket.updated` and
   `session.activity` events via `@nestjs/event-emitter`. X3 and M9 need to
   `eventEmitter.emit(...)` those events with the shapes in
   `src/notifications/events/notifications.listener.ts` — until they do,
   this listener just never fires; it won't break anything if merged early.

4. **G5 → M1/X3/anyone else who wants to send mail**: don't duplicate a
   mailer — inject `EmailService` and call `.enqueue(to, payload)`. M1's
   admin ingestion-failure alert should call this instead of building its
   own notification path.

5. **G4 rate limiting**: the spec calls for P1's rate-limiting middleware in
   front of the request endpoint specifically (email-enumeration/spam
   target). Not included here since it's P1's middleware to apply — just
   make sure `/auth/password-reset/request` is in scope for it.

## Known gaps / explicitly out of scope here

- **Expired-token cleanup**: `PasswordResetService.purgeExpired()` exists
  but nothing schedules it. Wire it into a cron (`@nestjs/schedule`) or
  P4's ops page.
- **No rate limiting** on `/auth/password-reset/request` itself (see point 5
  above) — this is the single biggest security gap if merged as-is.
- **No admin submission flow for testimonials** — spec says "ideally
  sourced post-launch"; current implementation assumes an admin manually
  creates rows via the D5-style panel. A public "submit a testimonial" form
  posting to a moderation queue would be a straightforward add if the demo
  wants it.
- **SMTP only** for G5 — no SES/SendGrid HTTP API integration. Fine for a
  hackathon demo; swap `mail-transport.provider.ts` if you later need
  provider-specific features (bounce webhooks, etc.).

## Running the tests

```bash
npm install
npx jest src/testimonials src/password-reset src/notifications
```

All three spec files use mocked repositories — no live Postgres/Redis
needed to run them.
