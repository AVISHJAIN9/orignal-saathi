# Module P1: Authentication & Global Rate Limiting

The **P1** module provides lightweight JWT session authentication, Role-Based Access Control (RBAC), and distributed Redis-backed rate limiting for the **SAATHI BIS Assistant** platform.

---

## 🚀 Key Features

1. **Authentication (`AuthService`, `AuthController`)**:
   - **Registered User Login (`POST /api/v1/auth/login`)**: Validates credentials via `bcrypt` against PostgreSQL `users` table and issues a signed JWT.
   - **Anonymous User Login (`POST /api/v1/auth/anonymous`)**: Issues scoped lightweight JWT sessions for public users interacting with the BIS assistant.
   - **User Registration (`POST /api/v1/auth/register`)**: Provisions accounts with specific roles (`public`, `industry`, `admin`).
   - **Identity Profile (`GET /api/v1/auth/me`)**: Retrieves authenticated session context.

2. **Role-Based Access Control (RBAC)**:
   - **`@Roles(UserRole.ADMIN)` Decorator**: Attaches role requirements to routes.
   - **`RolesGuard`**: Enforces role hierarchy and permission checking before route execution.
   - **`JwtAuthGuard`**: Validates bearer tokens and injects authenticated user payload (`userId`, `username`, `role`, `isAnonymous`) into the request.

3. **Global Distributed Rate Limiting (`ThrottlerModule` + Redis)**:
   - Tracks client IP / token requests globally using `throttler-storage-redis` across multiple NestJS microservice instances.
   - Default global limit: **10 requests / minute**.
   - Custom overrides via `@Throttle()` and `@SkipThrottle()`.

---

## 📁 Directory Structure

```
p1/
├── src/
│   ├── modules/
│   │   └── auth/
│   │       ├── decorators/
│   │       │   ├── current-user.decorator.ts
│   │       │   ├── public.decorator.ts
│   │       │   └── roles.decorator.ts
│   │       ├── dto/
│   │       │   └── login.dto.ts
│   │       ├── entities/
│   │       │   └── user.entity.ts
│   │       ├── guards/
│   │       │   ├── jwt-auth.guard.ts
│   │       │   └── roles.guard.ts
│   │       ├── strategies/
│   │       │   └── jwt.strategy.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.module.ts
│   │       └── auth.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── auth.service.spec.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🛠️ Installation & Setup

```bash
cd p1

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run unit tests
npm test

# Start service in development mode
npm run start:dev
```

---

## 🔒 API Endpoints & Throttling Limits

| Method | Endpoint | Description | Guard / RBAC | Throttling Rate |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Login user/admin | Public | 5 req / min |
| `POST` | `/api/v1/auth/anonymous` | Anonymous session token | Public | 20 req / min |
| `POST` | `/api/v1/auth/register` | Register new account | Public | 5 req / min |
| `GET` | `/api/v1/auth/me` | Current user profile | `JwtAuthGuard` | Global (10 req/min) |
| `GET` | `/api/v1/auth/admin/stats` | BIS Administrative Stats | `JwtAuthGuard`, `RolesGuard` (`admin`) | Global (10 req/min) |
| `GET` | `/api/v1/auth/health` | Health Check | Public | `@SkipThrottle()` (Unlimited) |
