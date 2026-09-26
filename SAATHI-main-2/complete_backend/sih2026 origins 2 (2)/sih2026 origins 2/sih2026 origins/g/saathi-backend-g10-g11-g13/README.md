# SAATHI backend — G10, G11, G13

Backend-only implementation of three more Website Essentials Checklist
items from the SIH26107 build spec, same stack and conventions as the
G3-G6 delivery (NestJS + TypeORM/Postgres where needed, ports for
cross-owner dependencies, in-memory placeholders that compile standalone).

## What's in here, by spec ID

| ID | Feature | What's implemented |
|----|---------|---------------------|
| **G10** | CAPTCHA Integration | Provider-agnostic `CaptchaService` (reCAPTCHA v3 score-based, or hCaptcha pass/fail — pick via `CAPTCHA_PROVIDER`), with action verification, request timeouts, an infra-failure-only fail-open toggle, failure telemetry via `captcha.verification.failed` events, and a `GET /captcha/config` endpoint exposing the active provider/site-key. `CaptchaGuard` (+ optional `@CaptchaAction(...)`) to drop onto any public entry point. No DB — matches the spec's "NO" for storage. |
| **G11** | Two-Factor Authentication | TOTP setup/enable/disable self-service endpoints under `/auth/2fa/*` (admin-only); backup codes (10, single-use, hashed at rest); `TwoFactorService.verifyLoginCode()` for P1's login controller to call as the second factor. |
| **G13** | XML Sitemap | `GET /sitemap.xml` — static public pages + dynamic standards URLs from D2, cached in memory and invalidated on `standards.created/updated/removed` events (1-hour TTL fallback if those events never fire). |

## Integration points — read before merging

1. **G10 → whoever owns the public entry points (D1, X6)**: `CaptchaGuard`
   is exported by `CaptchaModule` but deliberately not applied to any route
   in this delivery — this module doesn't own D1's chat entry or X6's
   WhatsApp opt-in. Whoever does needs to:
   ```ts
   @UseGuards(CaptchaGuard, ThrottlerGuard) // captcha before rate limiting, per spec
   @CaptchaAction('chat_submit') // optional — omit if the frontend doesn't pass an action
   ```
   and have the frontend send the token as either an `x-captcha-token`
   header or `captchaToken` in the body — check `captcha.guard.ts` and drop
   whichever branch isn't used. The frontend should call
   `GET /captcha/config` rather than hardcoding a site key, so switching
   `CAPTCHA_PROVIDER` never requires a frontend deploy.

2. **G11 → P1 (Auth)**: same `Port` pattern as G4's `UsersPort`. Bound to
   `InMemoryTwoFactorPort` (forgets everything on restart) until P1's owner
   implements `TwoFactorPort` against the real credentials table and swaps
   the provider in `two-factor.module.ts`. The bigger integration point:
   **`verifyLoginCode()` is a direct service call, not an HTTP route** —
   P1's login controller needs `TwoFactorModule` imported and the snippet
   in `app.module.snippet.ts` added to its password-check success path.
   Skipping this means 2FA setup "works" but is never actually enforced at
   login.

3. **G13 → D2 (Standards)**: `StandardsPort.listPublicSlugs()` returns `[]`
   from the in-memory placeholder, so the sitemap renders with just the 5
   static pages until D2's owner wires a real adapter. Also review the
   `STATIC_PAGES` array in `sitemap.service.ts` — it's a reasonable guess at
   the public route list, not sourced from D1/D8/D9's actual frontend
   routing.

4. **G13 cache invalidation**: for the sitemap to actually update on content
   change (not just every hour), whoever owns M1/D2's ingestion-complete
   path needs to `eventEmitter.emit('standards.updated', ...)` (or
   `.created`/`.removed`). No payload shape required — `SitemapService`
   ignores the event body and just invalidates.

## Known gaps / explicitly out of scope here

- **G10**: no CAPTCHA challenge widget (that's frontend, D1/X6's territory).
  `captcha.verification.failed` events are emitted on every rejection (bad
  token, low score, action mismatch, infra error) but nothing currently
  subscribes to them — wire a listener into X8 (gap/usage analytics) if the
  team wants visibility into bot-traffic volume; per spec there's no new
  table for this, so keep it event-based rather than adding one.
  `CAPTCHA_FAIL_OPEN` is a real decision the team needs to make once, not
  leave at the default: fail-closed (default) means a reCAPTCHA outage
  blocks whatever it's guarding; fail-open trades that for letting bots
  through during the outage window. Either is defensible — just pick one on
  purpose.
- **G11**: no SMS OTP path, only TOTP (authenticator-app based) — spec says
  "TOTP/SMS OTP"; TOTP needs no third-party SMS provider or per-message
  cost, which is the more hackathon-appropriate default. Swap in an SMS
  provider adapter later if the demo specifically wants it.
- **G11**: `two-factor.service.spec.ts` generates real TOTP codes in tests
  (via `otplib`) rather than mocking — this is intentional, it's the only
  way to actually exercise the verification logic, but means the tests are
  time-sensitive to within the ±1 step window configured in the service.
- **G13**: no `<lastmod>` on static pages (they don't have a natural
  "updated at" without tracking page content separately) — only dynamic
  standards entries get it, per the sitemap protocol's optional-field rules.

## Running the tests

```bash
npm install
npx jest src/captcha src/two-factor src/sitemap
```

All spec files use mocked ports/providers — no live network calls, Redis,
or Postgres needed.
