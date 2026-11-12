# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**. Node app is NestJS 11 + Prisma 7 (PostgreSQL via `@prisma/adapter-pg`).

```bash
docker compose up -d          # infra only: Postgres 17 (postgres/postgres, db travel_platform, :5432) + Mailhog (SMTP :1025, UI :8025)
docker compose --profile app up -d --build   # also `migrate` (prisma migrate deploy) + `api` containers
pnpm start                    # nest start --watch (Swagger at /api/docs)
pnpm build                    # nest build -> dist/
pnpm lint / pnpm lint:fix     # oxlint (not ESLint)
pnpm format / format:check    # oxfmt (not Prettier)
pnpm test                     # unit tests: vitest run (all *.spec.ts), no DB needed
pnpm test:int                 # integration tests: *.int-spec.ts, real AppModule + Postgres (needs docker compose up -d)
pnpm vitest run src/modules/v1/bookings/bookings.service.spec.ts   # single file
pnpm vitest run -t "throws NotFoundException"                      # by test name
pnpm test:cov                 # fails below 60% coverage
pnpm exec tsc --noEmit        # typecheck (no dedicated script)
pnpm prisma:generate          # regenerate client into prisma/generated
npx prisma migrate dev --name <name>   # new migration (the `migration` script hardcodes ANY_NAME)
```

Env (`.env`, loaded via `dotenv/config`):

- Required: `DATABASE_URL`, `JWT_SECRET`.
- Optional (default): `JWT_ACCESS_EXPIRES_IN` (`15m`), `JWT_REFRESH_EXPIRES_IN` (`7d`), `EMAIL_VERIFICATION_EXPIRES_IN` (`24h`), `SMTP_HOST` / `SMTP_PORT` (`localhost` / `1025`), `MAIL_FROM` (`no-reply@travel-platform.local`), `PORT` (`3000`), `TEST_DATABASE_URL` (`.../travel_platform_test`).
- Inside Docker Compose, `DATABASE_URL` and `SMTP_HOST` are overridden to point at the `postgres` / `mailhog` services.

Pre-commit hook runs `pnpm lint-staged` (oxfmt) and `pnpm oxlint .`.

## Architecture

Strict classic NestJS layering: **Controller → Service → PrismaService**. Do not add repositories, use-cases, CQRS, DDD layers, `class-validator`/`class-transformer`, or new import aliases unless explicitly asked. Controllers stay thin (routing, guards, `ZodValidationPipe`, Swagger, call service); services own business logic, Prisma access, mapping to response DTOs, and throwing Nest HTTP exceptions. Never touch Prisma from controllers or expose Prisma entities/types as API DTOs (e.g. `passwordHash` must never leave the service).

### API versioning (v1 vs v2)

URI versioning with prefix `api/v`, default version `1`, configured in `src/configure-app.ts`. That file is shared by `main.ts` and the integration tests, so global app setup (filters, versioning, etc.) goes there, not into `main.ts`. Otherwise the tests run a different app, and every `/api/v2/...` route returns 404 in them. Features live in `src/modules/v1/*` and `src/modules/v2/*`.

- **v2 controllers reuse v1 services** (e.g. `@modules/v1/bookings/bookings.service`). v2-specific behavior is enabled through extra service parameters (e.g. `nativeStatus = true`, optional `idempotencyKey`), and v2 has its own response/query Zod schemas that controllers cast to. When changing a v1 service, check the v2 callers too; v2-only modules that do have services: `email-verifications`, `users/client-profiles.service.ts`, `notifications`, `analytics`.
- **Auth differs per version:**
  - v1: `AuthGuard` (`src/shared/guards/auth.guard.ts`) — trusts an `X-User-Id` header and loads the user from DB.
  - v2: `JwtAuthGuard` (passport-jwt, `src/shared/auth/`) with access + refresh tokens (`sessions` login/refresh/logout), `RolesGuard` + `@Roles()` (Admin | Agent | User), and `EmailVerifiedGuard` for actions requiring a verified email.
  - `@CurrentUser()` yields `AuthenticatedUser`. `AuthModule` is `@Global`.
- v2 booking creation requires an `Idempotency-Key` header (UUID v4, `@IdempotencyKey()` decorator); a replay with the same body returns 409 with the existing `bookingId` in `details`. Stored in the `idempotency-key` Prisma model.

### Cross-cutting

- **Validation:** Zod schemas in each feature's `schemas/` define request/response contracts; DTO types are `z.infer`. Use `@Body(new ZodValidationPipe(schema))` / `@Query(...)`.
- **Swagger:** separate hand-written classes in `schemas/swagger/` mirror the Zod schemas for docs; keep them in sync manually (no auto-generation).
- **Errors:** `GlobalExceptionFilter` formats all errors as `{ statusCode, error, message, details, path, timestamp }`. Just throw Nest HTTP exceptions; put structured extras in the `errors` field of the exception body (becomes `details`).
- **Booking status** transitions go through the State pattern in `src/modules/v1/bookings/states/booking-state.ts` (pending→confirmed|cancelled, confirmed→completed|cancelled, completed→cancelled; illegal → 409 in v2, 400 in v1).
- **Notifications (Outbox pattern, `src/modules/v2/notifications/`):** a booking status change and its notification rows are written in **one transaction**: an `email`/`pending` row and an `in_app`/`sent` row. Registration and resend-verification also enqueue an `email_verification` email. Emails are never sent inside the HTTP request. `NotificationsWorker` (`@nestjs/schedule` `@Interval`, every 10 s, batches of 20, skips overlapping runs) sends them via `MailService` (nodemailer → Mailhog) and marks each `sent` or `failed`. `GET /api/v2/notifications` returns **in-app only**, because email payloads may contain verification tokens.
- `src/shared/` is only for genuinely cross-feature infra (guards, pipes, decorators, filters, PrismaService).

### Prisma

- Multi-file schema in `prisma/schema/*.prisma`; config in `prisma.config.ts`. Client is generated to `prisma/generated` and imported via the `#prisma` alias (`import { PrismaClient, BookingStatus } from "#prisma"`).
- Never edit an already-applied migration; create a new one and regenerate the client.
- When upgrading Prisma, keep `@prisma/client` and `@prisma/client-runtime-utils` on the same version: the generated client imports the latter directly.

### Testing

- **Unit** (`*.spec.ts`): services and controllers are tested with ready-made mocks in `src/tests/mocks/` and provider helpers in `src/tests/providers/` (`provide-prisma.ts`, `provide-*-service.ts`). Reuse or extend these instead of hand-rolling mocks.
- **Integration** (`src/tests/integration/**/*.int-spec.ts`, config `vitest.integration.config.mjs`): supertest over the real `AppModule` against `travel_platform_test`. The DB is created and migrated in global setup and emptied before each test. Files run sequentially (`fileParallelism: false`). The suite **refuses to run** unless the database name ends in `_test`. `MailService` and `NotificationsWorker` are replaced with stubs in `src/tests/integration/helpers/test-app.ts`.

### Intentional deviations from the spec (do not "fix")

- v1 uses `pending` instead of the stage I `draft` status. A `completed` booking is shown as `confirmed` in v1 (v1 has no `completed`).
- An illegal status transition returns 400 in v1 (stage I behavior) and 409 in v2.
- Deleting someone else's offer returns 409 Conflict, not 403.
- There is no repository layer, and tests use Vitest instead of Jest.

### Aliases

`@modules/*`, `@shared/*`, `@services/*` (shared/services), `@pipes/*` (shared/pipes), `@tests/*`, `#prisma` — defined in both `tsconfig.json` and `vitest.config.mjs`; keep them in sync if changed.

## Detailed conventions

- `.claude/rules/project.md` — architecture rules (always loaded)
- `.claude/rules/nestjs.md` — NestJS conventions (loaded for `src/**/*.ts`)
- `.claude/rules/testing.md` — Vitest conventions (loaded for specs and `src/tests/**`)
- `.claude/skills/create-feature/` — step-by-step checklist for adding a new feature (`/create-feature`)
- `.cursor/rules/*.mdc` and `.cursor/skills/create-feature/` mirror the files above for Cursor. When you change a rule or the skill, change both copies.
