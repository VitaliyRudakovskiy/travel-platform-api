# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**. Node app is NestJS 11 + Prisma 7 (PostgreSQL via `@prisma/adapter-pg`).

```bash
docker compose up -d          # local Postgres 17 (postgres/postgres, db travel_platform, :5432)
pnpm start                    # nest start --watch (Swagger at /api/docs)
pnpm build                    # nest build -> dist/
pnpm lint / pnpm lint:fix     # oxlint (not ESLint)
pnpm format / format:check    # oxfmt (not Prettier)
pnpm test                     # vitest run (all *.spec.ts)
pnpm vitest run src/modules/v1/bookings/bookings.service.spec.ts   # single file
pnpm vitest run -t "throws NotFoundException"                      # by test name
pnpm test:cov
pnpm exec tsc --noEmit        # typecheck (no dedicated script)
pnpm prisma:generate          # regenerate client into prisma/generated
npx prisma migrate dev --name <name>   # new migration (the `migration` script hardcodes ANY_NAME)
```

Env (`.env`, loaded via `dotenv/config`): `DATABASE_URL`, `JWT_SECRET` (required), `JWT_ACCESS_EXPIRES_IN` (default `15m`), `PORT`.

Pre-commit hook runs `pnpm lint-staged` (oxfmt) and `pnpm oxlint .`.

## Architecture

Strict classic NestJS layering: **Controller → Service → PrismaService**. Do not add repositories, use-cases, CQRS, DDD layers, `class-validator`/`class-transformer`, or new import aliases unless explicitly asked. Controllers stay thin (routing, guards, `ZodValidationPipe`, Swagger, call service); services own business logic, Prisma access, mapping to response DTOs, and throwing Nest HTTP exceptions. Never touch Prisma from controllers or expose Prisma entities/types as API DTOs (e.g. `passwordHash` must never leave the service).

### API versioning (v1 vs v2)

URI versioning with prefix `api/v`, default version `1` (`src/main.ts`). Features live in `src/modules/v1/*` and `src/modules/v2/*`.

- **v2 controllers reuse v1 services** (e.g. `@modules/v1/bookings/bookings.service`). v2-specific behavior is enabled through extra service parameters (e.g. `nativeStatus = true`, optional `idempotencyKey`), and v2 has its own response/query Zod schemas that controllers cast to. When changing a v1 service, check the v2 callers too; v2-only modules that do have services: `email-verifications`, `users/client-profiles.service.ts`.
- **Auth differs per version:**
  - v1: `AuthGuard` (`src/shared/guards/auth.guard.ts`) — trusts an `X-User-Id` header and loads the user from DB.
  - v2: `JwtAuthGuard` (passport-jwt, `src/shared/auth/`) with access + refresh tokens (`sessions` login/refresh/logout), `RolesGuard` + `@Roles()` (Admin | Agent | User), and `EmailVerifiedGuard` for actions requiring a verified email.
  - `@CurrentUser()` yields `AuthenticatedUser`. `AuthModule` is `@Global`.
- v2 booking creation requires an `Idempotency-Key` header (UUID v4, `@IdempotencyKey()` decorator); a replay with the same body returns 409 with the existing `bookingId` in `details`. Stored in the `idempotency-key` Prisma model.

### Cross-cutting

- **Validation:** Zod schemas in each feature's `schemas/` define request/response contracts; DTO types are `z.infer`. Use `@Body(new ZodValidationPipe(schema))` / `@Query(...)`.
- **Swagger:** separate hand-written classes in `schemas/swagger/` mirror the Zod schemas for docs; keep them in sync manually (no auto-generation).
- **Errors:** `GlobalExceptionFilter` formats all errors as `{ statusCode, error, message, details, path, timestamp }`. Just throw Nest HTTP exceptions; put structured extras in the `errors` field of the exception body (becomes `details`).
- **Booking status** transitions go through the State pattern in `src/modules/v1/bookings/states/booking-state.ts` (pending→confirmed|cancelled, confirmed→completed|cancelled, completed→cancelled; illegal → 409).
- `src/shared/` is only for genuinely cross-feature infra (guards, pipes, decorators, filters, PrismaService).

### Prisma

- Multi-file schema in `prisma/schema/*.prisma`; config in `prisma.config.ts`. Client is generated to `prisma/generated` and imported via the `#prisma` alias (`import { PrismaClient, BookingStatus } from "#prisma"`).
- Never edit an already-applied migration; create a new one and regenerate the client.

### Aliases

`@modules/*`, `@shared/*`, `@services/*` (shared/services), `@pipes/*` (shared/pipes), `@tests/*`, `#prisma` — defined in both `tsconfig.json` and `vitest.config.mjs`; keep them in sync if changed.

## Detailed conventions

- `.claude/rules/project.md` — architecture rules (always loaded)
- `.claude/rules/nestjs.md` — NestJS conventions (loaded for `src/**/*.ts`)
- `.claude/rules/testing.md` — Vitest conventions (loaded for specs and `src/tests/**`)
- `.claude/skills/create-feature/` — step-by-step checklist for adding a new feature (`/create-feature`)
