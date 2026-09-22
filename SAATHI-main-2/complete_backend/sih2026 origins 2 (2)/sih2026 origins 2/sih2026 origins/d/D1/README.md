# SAATHI D1 — Conversational Chat Interface (SIH26107)

Backend API service for SAATHI's real-time AI conversational assistant with strict citations and factual grounding from Bureau of Indian Standards (BIS).

## Key Features
- **SSE Streaming Gateway**: Proxies real-time word-by-word token streams directly from Python/FastAPI RAG microservice (`M5`).
- **Turn Persistence & Placeholders**: Creates user messages and assistant placeholder rows on initial send; finalizes content, citation items, and confidence ratings upon stream completion.
- **Strict Citation Tracking**: Attaches granular clause, standard, table, and URL references (`JSONB`) to each message turn.
- **Session & History Scoping**: UUID conversation tracking with automatic title derivation and user-scoped listing.
- **Rate Limiting & Abuse Protection**: Integrated NestJS Throttler guard (`P1`).
- **RESTful Endpoints & Swagger**: Complete OpenAPI 3.0 specs available on `/api/docs`.

## Tech Stack
- **Framework**: NestJS 10 (TypeScript)
- **Database**: PostgreSQL 16 with TypeORM
- **Transport**: Server-Sent Events (`text/event-stream`) via RxJS `Observable<MessageEvent>` & HTTP REST
- **Upstream**: FastAPI M5 RAG Service

## Environment Variables
```env
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=saathi_db
RAG_SERVICE_URL=http://localhost:8000
THROTTLE_TTL=60
THROTTLE_LIMIT=60
```

## Running the Service
```bash
npm install
npm run start:dev
```
API Documentation: `http://localhost:5001/api/docs`
