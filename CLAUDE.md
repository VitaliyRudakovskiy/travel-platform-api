# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status: stage III in progress

The repository is a **Nest monorepo** being decomposed into microservices. The plan, decisions (D1–D7) and per-step checks are in `docs/stage3-plan.md`; read it before working on stage III.

```
apps/travel-platform-api/   # stage I–II monolith: all working code today; deleted at stage III step 9 (git tag stage-2)
apps/api-gateway/           # :3000 ┐ stage III services; empty skeletons (main.ts + empty module)
apps/auth-service/          # :3001 │ ← DONE (step 1): users, sessions, email verification, profiles; auth_db
apps/catalog-service/       # :3002 │ ← DONE (step 2): destinations, offers (TypeORM), catalog_db; gRPC :50052
apps/booking-service/       # :3003 │ ← DONE (step 3): bookings, favorites, analytics, booking_db; orchestration + outbox
apps/notification-service/  # :3004 ┘
libs/common/                # @app/common — infra shared by all apps (filter, Zod pipe, paginatedSchema, configureApp,
                            #   GatewayAuthGuard, RolesGuard/@Roles, EmailVerifiedGuard, @CurrentUser, UserRole)
libs/contracts/             # @app/contracts — service-to-service contracts: catalog.proto + gRPC types, availability/capacity
                            #   Zod schemas, booking event schemas (booking.created / booking.status_changed)
```

### Stage III services (how they differ from the monolith)

- **Code is copied from the monolith, not moved**; the monolith stays as the reference until step 9. Inside a service never import the monolith aliases (`@modules`, `@shared`, `@services`, `@tests`, `#prisma`): use relative paths, `@app/common`, and the service's own Prisma alias (`#auth-prisma`, …).
- **Auth:** services trust the headers set by the API Gateway. `GatewayAuthGuard` builds `request.user` (`AuthenticatedUser = { id, role, isEmailVerified }`) from `X-User-Id`, `X-User-Role`, `X-Email-Verified`: no `X-User-Id` → 401; `X-User-Id` without a valid role → 404 "User not found" (v1 `AuthGuard` contract). `RolesGuard` / `EmailVerifiedGuard` / `@CurrentUser()` from `@app/common` work on top of it. Until the gateway exists (step 6), send these headers manually.
- **Env:** each service reads only `apps/<service>/.env` via `ConfigModule.forRoot({ envFilePath })`. Never add `import "dotenv/config"` to a service `main.ts`: it loads the monolith's root `.env`, whose `DATABASE_URL` would win.
- **Internal API** (`/internal/v1/...`, service-to-service only): controllers use `version: VERSION_NEUTRAL` (otherwise the path gets the `/api/v1` prefix) and `@ApiExcludeController()`. HTTP clients use `@nestjs/axios` with a 5 s timeout.
- **auth-service specifics:** issues JWTs (`{ sub, role }`) but does not validate them (gateway's job). Login (`POST /api/v{1,2}/sessions`) goes through passport-local: `LocalAuthGuard` validates the body with `loginSchema` first, because guards run before pipes and a plain `AuthGuard("local")` would turn a 400 into a 401. Verification emails are handed to notification-service over HTTP after the commit; a failure is only logged. `GET /internal/v1/users/:id` → `{ id, email, role, isEmailVerified }`.
- **catalog-service specifics (TypeORM, not Prisma):** entities in `modules/v1/*/entities`, one options factory `src/database/typeorm.options.ts` for the app and the CLI (`data-source.ts`); `synchronize: false`, migrations only, applied on startup (`migrationsRun`), `uuidExtension: "pgcrypto"` (`gen_random_uuid()`). Enums are const objects in `modules/v1/offers/models/offer.enums.ts`. Gotchas: NUMERIC comes back as a string from `pg` → `decimalTransformer`; `QueryBuilder.returning([...])` takes entity **property** names while `result.raw` rows have **column** names (column names silently return nothing); soft delete via `@DeleteDateColumn` hides rows from every `find*` (use `withDeleted` when needed). Offers no longer embed `user` (users are in auth_db). Internal API: `GET /internal/v1/offers/:id/availability` → `{ available, remainingCapacity, reason?, message? }` (200 even when unavailable; `reason` lets booking-service map to 404/400/409), `PATCH /internal/v1/offers/:id/capacity { reservedDelta: 1 | -1 }` = one atomic conditional UPDATE of `reserved_capacity` (+ DB CHECK), 409 at the bounds. gRPC (hybrid app, `connectMicroservice`): `GetOffer`, `GetOffersByIds`, `ListOfferIdsByOwner`; the `.proto` is copied to `dist` by `assets` in `nest-cli.json`.
- **booking-service specifics:** `CatalogClient` (`modules/catalog-client`) is the only code that calls catalog-service: HTTP for availability/capacity, gRPC for offers; errors → 503 (unreachable/timeout), 404, 409. Booking creation (v1 and v2) = orchestration: idempotency check (before any catalog call) → gRPC offer → availability (reason → 404/400/409 as in stage II) → reserve `+1` → ONE transaction (booking + idempotency key + outbox `booking.created`) → on failure compensate `-1` (also when reserve itself fails with 503; never on 409/404). Every status change (v1 and v2) writes `booking.status_changed` to `outbox_events` in the same transaction; cancelled/completed release the slot AFTER the commit, once (`capacityReleased` flag; on failure it only logs). `Booking.offerOwnerId` is captured at creation (Agent scope and events without calling catalog). The embedded `offer` in booking/favorite responses comes from gRPC and is omitted if catalog-service is down (optional in the contract); analytics by destination needs catalog (503). Notifications are no longer created here: events are published in step 4 and turned into notifications by notification-service (step 5).
- **Dependency pins:** Nest packages must stay on the same version line as `@nestjs/core` (11.1.x): `@nestjs/microservices` is pinned to an exact version (11.2.x imports files missing from core 11.1). Use `typeorm@0.3` with `@nestjs/typeorm@11`.

Unless stated otherwise, everything below the Commands section describes the monolith, and `src/...` means `apps/travel-platform-api/src/...`.

## Commands

Package manager is **pnpm**. NestJS 11 + Prisma 7 (PostgreSQL via `@prisma/adapter-pg`).

```bash
docker compose up -d          # infra: monolith Postgres (:5432, db travel_platform), Mailhog (SMTP :1025, UI :8025),
                              # service DBs auth_db :5433, catalog_db :5434, booking_db :5435, notify_db :5436
                              # (all postgres/postgres), RabbitMQ (:5672, UI :15672 guest/guest), Redis (:6379)
docker compose --profile app up -d --build   # also the monolith's `migrate` + `api` containers
pnpm start                    # monolith, nest start --watch (Swagger at /api/docs)
pnpm start:gateway | start:auth | start:catalog | start:booking | start:notification   # one service, watch mode
pnpm build                    # nest build --all -> dist/apps/<app>/apps/<app>/src/main.js
pnpm start:prod               # built monolith
pnpm lint / pnpm lint:fix     # oxlint (not ESLint)
pnpm format / format:check    # oxfmt (not Prettier)
pnpm test                     # unit tests: vitest run (all *.spec.ts in apps/ and libs/), no DB needed
pnpm test:int                 # monolith integration tests: *.int-spec.ts, real AppModule + Postgres (needs docker compose up -d)
pnpm vitest run apps/travel-platform-api/src/modules/v1/bookings/bookings.service.spec.ts   # single file
pnpm vitest run -t "throws NotFoundException"                                              # by test name
pnpm test:cov                 # fails below 60% coverage
pnpm exec tsc --noEmit        # typecheck (no dedicated script)
pnpm prisma:generate          # regenerate the monolith client into prisma/generated (committed)
npx prisma migrate dev --name <name>   # new monolith migration (the `migration` script hardcodes ANY_NAME)

# auth-service (needs apps/auth-service/.env; Prisma config apps/auth-service/prisma.config.ts)
pnpm prisma:generate:auth     # client -> apps/auth-service/prisma/generated (gitignored: run after clone / schema change)
pnpm migrate:auth --name <name>   # prisma migrate dev against auth_db
pnpm seed:auth                # admin/agent/user @travel.local, password Password123!, fixed ids 00000000-0000-4000-8000-00000000000{1,2,3}
pnpm studio:auth              # Prisma Studio on :5561
```

Env (`.env`, loaded via `dotenv/config`; monolith):

- Required: `DATABASE_URL`, `JWT_SECRET`.
- Optional (default): `JWT_ACCESS_EXPIRES_IN` (`15m`), `JWT_REFRESH_EXPIRES_IN` (`7d`), `EMAIL_VERIFICATION_EXPIRES_IN` (`24h`), `SMTP_HOST` / `SMTP_PORT` (`localhost` / `1025`), `MAIL_FROM` (`no-reply@travel-platform.local`), `PORT` (`3000`), `TEST_DATABASE_URL` (`.../travel_platform_test`).
- Inside Docker Compose, `DATABASE_URL` and `SMTP_HOST` are overridden to point at the `postgres` / `mailhog` services.

Pre-commit hook runs `pnpm lint-staged` (oxfmt) and `pnpm oxlint .`.

## Monorepo build

- `nest-cli.json` has `webpack: false` (webpack breaks the generated Prisma client). Every `apps/<app>/tsconfig.app.json` sets `rootDir: "../.."`, so the output layout is always `dist/apps/<app>/apps/<app>/src/main.js` and `entryFile` is `apps/<app>/src/main`. Keep this when adding an app; otherwise the layout silently changes the first time the app imports from `libs/`.
- Nest CLI rewrites `tsconfig.json` → `paths` aliases into relative paths computed from the **source** file. That works for `apps/` and `libs/` (compiled into `dist`) but breaks for anything outside `dist`. Therefore Prisma clients are resolved through `package.json` → `imports` **only** (`#prisma`; later `#auth-prisma`, `#booking-prisma`, `#notify-prisma`), never through `paths`. Vitest still needs each alias in `vitest.config.mjs`.

## Architecture

Strict classic NestJS layering: **Controller → Service → PrismaService**. Do not add repositories, use-cases, CQRS, DDD layers, `class-validator`/`class-transformer`, or new import aliases unless explicitly asked. Controllers stay thin (routing, guards, `ZodValidationPipe`, Swagger, call service); services own business logic, Prisma access, mapping to response DTOs, and throwing Nest HTTP exceptions. Never touch Prisma from controllers or expose Prisma entities/types as API DTOs (e.g. `passwordHash` must never leave the service).

### API versioning (v1 vs v2)

URI versioning with prefix `api/v`, default version `1`, configured in `configureApp` (`libs/common/src/configure-app.ts`). It is shared by `main.ts` and the integration tests, so global app setup (filters, versioning, etc.) goes there, not into `main.ts`. Otherwise the tests run a different app, and every `/api/v2/...` route returns 404 in them. Features live in `src/modules/v1/*` and `src/modules/v2/*`.

- **v2 controllers reuse v1 services** (e.g. `@modules/v1/bookings/bookings.service`). v2-specific behavior is enabled through extra service parameters (e.g. `nativeStatus = true`, optional `idempotencyKey`), and v2 has its own response/query Zod schemas that controllers cast to. When changing a v1 service, check the v2 callers too; v2-only modules that do have services: `email-verifications`, `users/client-profiles.service.ts`, `notifications`, `analytics`.
- **Auth differs per version:**
  - v1: `AuthGuard` (`src/shared/guards/auth.guard.ts`) — trusts an `X-User-Id` header and loads the user from DB.
  - v2: `JwtAuthGuard` (passport-jwt, `src/shared/auth/`) with access + refresh tokens (`sessions` login/refresh/logout), `RolesGuard` + `@Roles()` (Admin | Agent | User), and `EmailVerifiedGuard` for actions requiring a verified email.
  - `@CurrentUser()` yields `AuthenticatedUser`. `AuthModule` is `@Global`.
- v2 booking creation requires an `Idempotency-Key` header (UUID v4, `@IdempotencyKey()` decorator); a replay with the same body returns 409 with the existing `bookingId` in `details`. Stored in the `idempotency-key` Prisma model.

### Cross-cutting

- **Validation:** Zod schemas in each feature's `schemas/` define request/response contracts; DTO types are `z.infer`. Use `@Body(new ZodValidationPipe(schema))` / `@Query(...)`; `ZodValidationPipe` comes from `@app/common`.
- **Swagger:** separate hand-written classes in `schemas/swagger/` mirror the Zod schemas for docs; keep them in sync manually (no auto-generation).
- **Errors:** `GlobalExceptionFilter` (`@app/common`) formats all errors as `{ statusCode, error, message, details, path, timestamp }`. Just throw Nest HTTP exceptions; put structured extras in the `errors` field of the exception body (becomes `details`).
- **Booking status** transitions go through the State pattern in `src/modules/v1/bookings/states/booking-state.ts` (pending→confirmed|cancelled, confirmed→completed|cancelled, completed→cancelled; illegal → 409 in v2, 400 in v1).
- **Notifications (Outbox pattern, `src/modules/v2/notifications/`):** a booking status change and its notification rows are written in **one transaction**: an `email`/`pending` row and an `in_app`/`sent` row. Registration and resend-verification also enqueue an `email_verification` email. Emails are never sent inside the HTTP request. `NotificationsWorker` (`@nestjs/schedule` `@Interval`, every 10 s, batches of 20, skips overlapping runs) sends them via `MailService` (nodemailer → Mailhog) and marks each `sent` or `failed`. `GET /api/v2/notifications` returns **in-app only**, because email payloads may contain verification tokens.
- **Shared code:** `libs/common` holds infra used by several apps and must not depend on any app (no app DTOs, no app Prisma client). The monolith's `src/shared/` holds its own cross-feature infra (auth, guards, decorators, PrismaService). Feature code goes in neither.

### Prisma

- Monolith: multi-file schema in `prisma/schema/*.prisma`; config in `prisma.config.ts` (both at the repo root). Client is generated to `prisma/generated` and imported via `#prisma` (`import { PrismaClient, BookingStatus } from "#prisma"`).
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

- `@app/common` → `libs/common/src` (import from the root: `from "@app/common"`).
- Monolith: `@modules/*`, `@shared/*`, `@services/*` (shared/services), `@tests/*` → `apps/travel-platform-api/src/...`.
- Defined in both `tsconfig.json` and `vitest.config.mjs`; keep them in sync if changed. `#prisma` is in `package.json` → `imports` and `vitest.config.mjs` only (see Monorepo build).

## Detailed conventions

- `.claude/rules/project.md` — architecture rules (always loaded)
- `.claude/rules/nestjs.md` — NestJS conventions (loaded for `apps/**/*.ts`, `libs/**/*.ts`)
- `.claude/rules/testing.md` — Vitest conventions (loaded for specs and `apps/*/src/tests/**`)
- `.claude/skills/create-feature/` — step-by-step checklist for adding a new feature (`/create-feature`)
- `.cursor/rules/*.mdc` and `.cursor/skills/create-feature/` mirror the files above for Cursor. When you change a rule or the skill, change both copies.
