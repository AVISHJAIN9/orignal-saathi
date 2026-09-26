# SAATHI — D10: Role-Based Views (Backend)

Backend-only implementation of **D10 — Role-Based Views (Public / Industry / Admin)**
from the SIH26107 SAATHI Feature Matrix. Per the matrix this feature is:

| Layer | Scope |
|---|---|
| Frontend | Distinct default views per role — same data, different lens (not in this repo) |
| **Backend** | **RBAC built on P1's auth; per-role feature-access scoping middleware** |
| AI/ML | None — pure access-control feature |
| Data & Storage | `role` column on the user table |

Owner: Person 2. Build order: Gate 5 (Polish) — not demo-blocking on its own, but
every other role-gated feature (D5 admin panel, X10 API keys, G11 2FA) leans on
the guards this module exports, so it's worth having in place early.

This package is deliberately **self-contained**: it doesn't reimplement P1's
login/JWT logic, it defines a small `AuthenticatedRequest` contract and expects
whatever sits in front of it (P1's real guard, or the `DemoJwtAuthGuard` included
here for standalone dev) to satisfy it.

## Folder structure

```
src/
├── main.ts                     # standalone bootstrap (disposable once merged into the monolith)
├── app.module.ts                # wires global RolesGuard/FeatureAccessGuard + FeatureScopeMiddleware
├── index.ts                     # barrel export for consuming this as a package
├── common/
│   ├── enums/role.enum.ts       # Role.PUBLIC | INDUSTRY | ADMIN
│   ├── constants.ts             # metadata keys + DEFAULT_ROLE
│   ├── decorators/
│   │   ├── roles.decorator.ts          # @Roles(Role.ADMIN)
│   │   ├── require-feature.decorator.ts # @RequireFeature('X6')
│   │   └── current-user.decorator.ts    # @CurrentUser() in a handler
│   ├── guards/
│   │   ├── roles.guard.ts              # enforces @Roles()
│   │   ├── feature-access.guard.ts     # enforces @RequireFeature()
│   │   └── demo-jwt-auth.guard.ts      # STANDALONE ONLY — replace with P1's guard
│   ├── interfaces/
│   │   ├── authenticated-request.interface.ts  # the req.user contract
│   │   └── feature-access-config.interface.ts
│   └── middleware/
│       └── feature-scope.middleware.ts # attaches req.allowedFeatures per request
├── config/
│   ├── configuration.ts
│   └── feature-access.config.ts # the role -> feature-ID map (edit this to change access)
├── database/
│   ├── data-source.ts
│   └── migrations/1735500000000-AddRoleToUsers.ts
└── modules/
    ├── users/                   # minimal User entity/service D10 needs (role column)
    ├── rbac/                    # admin-only PATCH /admin/users/:id/role
    └── views/                   # GET /views/config — role-scoped view config for D1's frontend

test/                            # jest unit tests for every guard + the middleware
```

## How the pieces fit together

1. **Auth runs first.** `DemoJwtAuthGuard` (dev) or P1's real guard/middleware
   populates `req.user = { id, role, email? }`. D10 never issues tokens or
   checks passwords — it only reads what auth left behind.
2. **`FeatureScopeMiddleware`** runs on every request and computes
   `req.allowedFeatures` from `feature-access.config.ts` based on `req.user.role`
   (defaulting to `Role.PUBLIC` for anonymous traffic, since D1/D2/D3 are meant
   to work without a login wall).
3. **`RolesGuard`** and **`FeatureAccessGuard`** are registered globally in
   `AppModule` (`APP_GUARD`). They're no-ops unless a route is decorated with
   `@Roles(...)` or `@RequireFeature(...)` — so mounting this module doesn't
   accidentally lock down routes from other features.
4. Any other feature module (D5's admin panel, X10's API-key management, G11's
   2FA-gated actions) can import `Roles`, `RequireFeature`, `RolesGuard`, and
   `FeatureAccessGuard` from this package and decorate its own controllers —
   no need to re-implement RBAC per feature.

## Linking into the main SAATHI backend

This was built as an isolated NestJS app so it runs and tests on its own, but
it's structured to merge cleanly:

1. Delete `demo-jwt-auth.guard.ts` and `src/main.ts`'s standalone bootstrap.
2. Register P1's real auth guard/middleware ahead of `RolesGuard` /
   `FeatureAccessGuard` in the monolith's `main.ts` or root module — as long as
   it populates `req.user` per `AuthenticatedRequest`, nothing else here changes.
3. Import `UsersModule`, `RbacModule`, `ViewsModule` into the monolith's root
   `AppModule` (or keep this repo as an npm/yarn workspace package and import
   from `@saathi/d10-role-based-views` via `src/index.ts`).
4. If P1 already defines a `User`/`users` table entity, drop this repo's
   `User` entity and instead add the `role` column (see the migration below)
   directly onto P1's entity — D10's job is that one column, not the table.
5. Run the migration **after** P1's own users-table migration.

## Running standalone

```bash
npm install
cp .env.example .env      # point DATABASE_URL at your Postgres instance
npm run migration:run     # adds the role column + enum to `users`
npm run start:dev         # http://localhost:3001, Swagger at /docs
```

Mint a demo token for local testing (matches `DemoJwtAuthGuard`):

```js
const jwt = require('jsonwebtoken');
console.log(jwt.sign({ sub: 'demo-user', role: 'admin' }, 'dev-only-secret-do-not-use-in-prod'));
```

## Testing

```bash
npm test        # RolesGuard, FeatureAccessGuard, FeatureScopeMiddleware, RbacService
npm run test:cov
```

## Design notes

- **Roles vs. features are two separate axes.** `@Roles()` answers "is this
  identity allowed to touch this endpoint at all"; `@RequireFeature()` answers
  "is this feature turned on for this identity right now." Keeping them
  separate means a feature can be killed globally (`globallyDisabled`) for an
  incident or a phased X1–X12 rollout without touching a single `@Roles()`
  decorator anywhere.
- **Global guards, opt-in decorators.** `RolesGuard`/`FeatureAccessGuard` are
  applied app-wide but do nothing unless a route opts in — safe to drop into
  an existing app without a big-bang audit of every controller.
- **`feature-access.config.ts` is the one file to edit** when a feature moves
  between Gates (e.g. an X-series differentiator graduating from
  ADMIN/INDUSTRY-only to PUBLIC) — no guard or controller code changes.
- **Additive migration**, not a new table — D10's only DB footprint is the
  `role` column + enum on the `users` table P1 owns, matching the Feature
  Matrix exactly.
