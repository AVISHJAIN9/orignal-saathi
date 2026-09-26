# SAATHI — D4: Conversation History (backend)

SIH26107 · Feature Matrix ID **D4** · Owner: Person 1

> Saved past sessions per user, click-to-resume without re-asking.
> Pure CRUD/retrieval feature — no AI/ML work. Reads (never writes)
> the `conversations` / `messages` tables, which are shared,
> cross-cutting schema (D1 and M9 write to them; D4 only reads).

## Stack

| Layer | Master spec (Part 3) | This service |
|---|---|---|
| Backend | Node.js + NestJS (TypeScript) | NestJS |
| Storage | Postgres, relational schema, pgvector | TypeORM → Postgres |
| Auth | JWT for the API | Not built here — see "No auth layer yet" |

This is the master build spec's stack, applied literally: Part 3 names
**"conversation history"** by name as a NestJS backend responsibility,
and pgvector-on-Postgres as the storage layer. D4 doesn't deviate from
either.

### A note on matching D3

An earlier draft of this README claimed D4 was built to share
`main.ts`, `ValidationPipe`, and throttling setup "identically" with
`saathi-d3-citation-viewer`. That turned out not to be accurate once
checked against the actual D3 zip: **D3 is a plain JavaScript
Express + Mongoose service** (`server.js`/`app.js`, Express
middleware, MongoDB) — not NestJS, not TypeORM, not Postgres. It
predates (or simply didn't follow) the master spec's stack decision.

So, to be precise about what is and isn't shared with D3:

- **Not shared, because the frameworks are genuinely different:** the
  bootstrap file, the exception-handling mechanism (Nest
  `ExceptionFilter` vs. Express middleware), the validation layer
  (Nest `ValidationPipe` vs. hand-rolled checks), the ORM, the
  database engine itself. If D1/D3/D4/D8 are ever merged into one
  process for Person 1, **D3 is the one that would need porting to
  Nest + Postgres** — not the other way around — since D4 already
  matches the spec D3 was supposed to follow.
- **Shared, because it's engineering philosophy rather than
  framework-specific code:** returning the same generic response for
  "not found" and "not yours" so a 404 can't be used to probe for
  other users' data; validating a client-supplied identifier at the
  edge before it reaches a query; a pure, dependency-free utility
  module for logic that doesn't need a framework; splitting
  read-only service logic (never throws an `HttpException`) from the
  HTTP-translation layer that does. Each of these shows up below with
  a pointer to where D3 does the equivalent thing in its own idiom.

## What this service does

Exactly the two backend items the feature matrix lists for D4:

1. **Cursor-paginated list endpoint, ordered by `updated_at`** — a
   user's most recently active conversation surfaces first, and the
   list stays stable page-to-page even while other conversations are
   actively being updated elsewhere (see "Why keyset, not OFFSET"
   below).
2. **Resume endpoint loading full message history** — given a
   conversation id, returns that conversation plus every message in
   it, oldest first, ready for the frontend to replay straight into
   the chat view.

Nothing else. Creating conversations and messages is D1's job
("persists user message on send and assistant message on stream
completion") and M9's (session management) — D4 only reads what they
write.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/conversations?userId=...&limit=20&cursor=...` | Cursor-paginated list, newest-updated first |
| GET | `/conversations/:id/resume?userId=...` | Full message history for one conversation |

```bash
curl "http://localhost:5004/conversations?userId=user-demo-1&limit=2"

# nextCursor from the response above, if hasMore was true
curl "http://localhost:5004/conversations?userId=user-demo-1&limit=2&cursor=<nextCursor>"

curl "http://localhost:5004/conversations/a1111111-1111-4111-8111-111111111111/resume?userId=user-demo-1"
```

`GET /conversations` responds with:

```json
{
  "conversations": [
    { "id": "...", "title": "...", "createdAt": "...", "updatedAt": "..." }
  ],
  "nextCursor": "eyJ1IjoiMjAyNi0wOC0yMFQwMDowMDowMC4wMDBaIiwiaWQiOiJhMTEx...",
  "hasMore": true
}
```

`nextCursor` is `null` once the last page is reached. Pass it straight
back as the `cursor` query param for the next page — it's opaque, the
client never decodes or constructs it itself.

## Why it's structured this way

- **Keyset pagination, not OFFSET/LIMIT**
  (`cursor.util.ts` + `ConversationsService.listForUser`). Sorting by
  `updated_at` means the result set reorders itself the instant a
  conversation gets a new message. With `OFFSET`, a user paging back
  through history while chatting elsewhere would silently skip or
  repeat rows. The cursor encodes `(updatedAt, id)` — `id` is the
  tiebreaker because two conversations can share `updated_at` down to
  the second, and that alone isn't unique enough to resume a scan
  from. Full reasoning is in `cursor.util.ts`'s header comment.
- **`take(limit + 1)`** — the service fetches one extra row to learn
  whether another page exists, then trims it off, instead of running a
  separate `COUNT(*)` per request.
- **`resume` returns `null` for both "no such conversation" and
  "belongs to a different user."** Same shape either way, so the
  controller's 404 never confirms or denies that a conversation id
  exists for someone else. This mirrors D3's reasoning for its
  signed-url endpoint: a malformed or disallowed S3 key gets one
  deliberately generic 400 rather than a message that would tell an
  attacker *which* check it failed.
- **`ParseUUIDPipe` on the `:id` route param** rejects a malformed
  conversation id at the edge with a clean 400, before it can reach a
  database query. This is the same job D3's `validateObjectId`
  middleware does for malformed Mongo ObjectIds — same intent
  ("catch a garbage identifier before it becomes a confusing 500"),
  different framework's idiom for it.
- **`cursor.util.ts` has zero NestJS imports.** Pure `encode`/`decode`
  functions that throw plain `Error`s, not `HttpException`s. The
  controller is the only place that knows a malformed cursor should
  become a 400; the service only ever receives an already-decoded
  `ConversationCursor` or `undefined`. This is the same
  service/controller split D3 uses for `CitationsService` — a plain
  framework-agnostic module (`isKeySafe` in D3's case) that any caller
  can unit-test without touching HTTP at all.
- **`MAX_RESUME_MESSAGES` is read inside a service method, not as a
  module-level constant.** NestJS resolves its module import graph
  *before* it runs `ConfigModule.forRoot()` — so a top-level
  `const MAX = parseInt(process.env.MAX_RESUME_MESSAGES)` would
  evaluate while `.env` hasn't been loaded yet, and silently keep the
  default forever. `ConversationsService.maxResumeMessages` is a
  getter instead, which only runs when a request actually calls
  `resume()` — well after bootstrap has finished loading `.env`.
  `ListConversationsQueryDto`'s `limit` bounds are, by deliberate
  contrast, hardcoded literals rather than env-driven: decorator
  arguments (`@Max(100)`) evaluate at that same too-early import time,
  so making them *look* env-configurable would be actively misleading
  — see that file's header comment for the full reasoning, and
  `config/typeorm.config.ts` for the same principle applied one layer
  further up, to the database connection itself.
- **`messages.citations` is stored as JSONB, not a join table.** D4
  never queries *by* citation — it only hands the array back to the
  client alongside the message it belongs to. D3's citation viewer is
  what resolves an individual citation id to full chunk context if the
  user clicks one.
- **Global `ValidationPipe`** (`whitelist` + `forbidNonWhitelisted` +
  `transform`) and a shared `AllExceptionsFilter` give every response —
  success or failure — one consistent shape. `AllExceptionsFilter`
  does the same conceptual job as D3's `errorHandler.js` middleware
  (uniform JSON envelope, log 5xx as errors, never leak a stack trace
  to the client) — implemented as a Nest `ExceptionFilter` because
  that's this framework's idiom for the same concern, not because the
  code itself is shared.

## No auth layer yet

P1 (Authentication & Rate Limiting) isn't built in this repo. Both
endpoints take `userId` as an explicit query parameter rather than
reading it off a session/JWT — the same kind of gap D3's README flags
for its own endpoints. **This means `userId` is currently self-reported
by the caller and must not be trusted as an authorization boundary in
this form.** Before this sits behind anything but a trusted internal
gateway, replace `query.userId` in both controller methods with
`req.user.id` from a real auth guard; the service layer already scopes
every query by `userId`, so no query logic needs to change — only
where that value comes from.

## Setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL
npm run migration:run       # creates conversations + messages (skip if D1/M9 already own them)
psql "$DATABASE_URL" -f scripts/seed.sql   # optional sample rows for local testing
npm run start:dev           # port 5004 by default
```

Or, with Docker (spins up a throwaway Postgres alongside the service):

```bash
docker compose up --build
docker compose exec app npm run migration:run
docker compose exec db psql -U saathi -d saathi_dev -f /seed.sql
```

## Tests

```bash
npm run typecheck   # tsc --noEmit
npm test             # jest — unit tests only, mocked repositories, no live Postgres needed
npm run build        # full compile, same as CI
```

Covers: keyset pagination (`hasMore`/`nextCursor` correctness, the
cursor's WHERE clause applied only when one is given, sort order,
per-user scoping), `resume`'s userId-scoped lookup and
null-for-not-found-or-not-yours behavior, the `MAX_RESUME_MESSAGES`
cap and its warning log (including an unparsable-env-value fallback),
cursor encode/decode round-tripping and every malformed-input case,
malformed-cursor rejection at the controller boundary, and the
exception filter's response shape (including that internal error
details never reach the client). A GitHub Actions workflow
(`.github/workflows/ci.yml`) runs `typecheck`, `test`, and `build` on
every push, per the master spec's DevOps note.

## Integration point for the rest of the team

- **D1** is the actual writer of `conversations` and `messages` — it
  creates the conversation row on the first message and appends a row
  per turn. D4 assumes that schema already exists; the migration here
  is a reference definition, not a claim of ownership (same caveat as
  D3's migration for `document_chunks`).
- **M9** touches `conversations.updated_at` on session activity — D4's
  list ordering depends on that being kept current by whoever owns
  that write path.
- **D8** (multi-language toggle) — if `messages.content` ever needs a
  parallel translated field, add it as a nullable column rather than a
  new table; D4's resume endpoint needs no code change either way,
  since it already returns the whole row shape via `toPublicMessage`.
