# Modsen Travel Platform API

Backend for a travel booking platform (Modsen, stage II): destinations, offers, bookings, favorites,
JWT authentication with roles, email verification, background notifications and admin analytics.

**Stack:** NestJS 11, TypeScript, PostgreSQL 17, Prisma 7 (`@prisma/adapter-pg`), Passport JWT,
Zod, `@nestjs/schedule`, Nodemailer + Mailhog, Swagger, Vitest, Docker.

## Quick start

### Local development

```bash
pnpm install
docker compose up -d              # Postgres (:5432) + Mailhog (:1025 SMTP, :8025 UI)
npx prisma migrate deploy
pnpm start                        # watch mode
```

### Everything in Docker

```bash
docker compose --profile app up -d --build
```

| Service    | What it does                                                                    |
| ---------- | ------------------------------------------------------------------------------- |
| `postgres` | PostgreSQL 17 with a healthcheck                                                |
| `mailhog`  | Fake SMTP server; every email the app sends is visible at http://localhost:8025 |
| `migrate`  | One-shot container: runs `prisma migrate deploy` and exits with code 0          |
| `api`      | The application; starts only after `migrate` has finished successfully          |

`migrate` and `api` live in the `app` profile, so a plain `docker compose up -d` still starts only the
infrastructure for local development. If `pnpm start` is already listening on the same port, run the
container on another one: `PORT=4300 docker compose --profile app up -d`.

### Useful URLs

| URL                                    | Description                      |
| -------------------------------------- | -------------------------------- |
| `http://localhost:<PORT>/api/docs`     | Swagger UI (v1 and v2)           |
| `http://localhost:<PORT>/api/v1`       | API v1                           |
| `http://localhost:<PORT>/api/v2`       | API v2                           |
| `http://localhost:<PORT>/health/ready` | Health check (Terminus, DB ping) |
| `http://localhost:8025`                | Mailhog inbox                    |

## Environment variables

Loaded from `.env` (never copied into the Docker image).

| Variable                        | Required | Default                          | Description                                   |
| ------------------------------- | -------- | -------------------------------- | --------------------------------------------- |
| `DATABASE_URL`                  | yes      | -                                | PostgreSQL connection string                  |
| `JWT_SECRET`                    | yes      | -                                | Secret used to sign access tokens             |
| `JWT_ACCESS_EXPIRES_IN`         | no       | `15m`                            | Access token TTL                              |
| `JWT_REFRESH_EXPIRES_IN`        | no       | `7d`                             | Refresh token TTL                             |
| `EMAIL_VERIFICATION_EXPIRES_IN` | no       | `24h`                            | Email verification token TTL                  |
| `SMTP_HOST` / `SMTP_PORT`       | no       | `localhost` / `1025`             | SMTP server (Mailhog)                         |
| `MAIL_FROM`                     | no       | `no-reply@travel-platform.local` | Sender address                                |
| `PORT`                          | no       | `3000`                           | HTTP port                                     |
| `TEST_DATABASE_URL`             | no       | `.../travel_platform_test`       | Database for integration tests (`_test` only) |

Inside Docker Compose, `DATABASE_URL` and `SMTP_HOST` are overridden to point at the `postgres` and
`mailhog` services: inside a container `localhost` is the container itself.

## Architecture

Classic NestJS layering: **Controller → Service → PrismaService**.

- **Controllers** handle HTTP only: routes, guards, `ZodValidationPipe`, Swagger, calling a service.
- **Services** own business rules, database access, mapping to response DTOs and HTTP exceptions.
- **Zod schemas** define request/response contracts; DTO types are `z.infer`. Prisma types are never
  exposed through the API (e.g. `passwordHash` never leaves a service).
- **`GlobalExceptionFilter`** formats every error as
  `{ statusCode, error, message, details, path, timestamp }`.

### API versioning: v1 and v2

URI versioning (`/api/v1`, `/api/v2`), default version `1`.

```
src/modules/
├── health/                  GET /health/ready
├── v1/                      Stage I API, kept working
│   ├── users  sessions  destinations  offers  bookings  favorites
└── v2/                      Stage II API
    ├── users  sessions  destinations  offers  bookings  favorites   ← controllers reuse v1 services
    ├── email-verifications                                          ← own service
    ├── users/client-profiles.service.ts                             ← own service
    ├── notifications                                                ← own service + worker
    └── analytics                                                    ← own service
```

**v2 controllers reuse v1 services.** Business logic lives in one place; v2-specific behavior is
switched on through extra service parameters (e.g. `nativeStatus = true`, an `idempotencyKey`), and v2
has its own response/query schemas. A v2 module gets its own service only when the logic is v2-only.

| Concern        | v1                               | v2                                                   |
| -------------- | -------------------------------- | ---------------------------------------------------- |
| Authentication | `X-User-Id` header (`AuthGuard`) | JWT access token (`Authorization: Bearer`) + refresh |
| Authorization  | owner checks                     | roles (`RolesGuard` + `@Roles()`) + owner checks     |
| Booking create | no extra requirements            | verified email + `Idempotency-Key` header            |

### Authentication (v2)

- `POST /api/v2/users`: register; creates the user **and an empty client profile** in one transaction
  and sends a verification email.
- `POST /api/v2/sessions`: login, returns `accessToken` (short-lived JWT) and `refreshToken`.
- `POST /api/v2/sessions/refresh`: new access token for a valid refresh token.
- `DELETE /api/v2/sessions`: logout, deletes the refresh token; reusing it returns 401.

Refresh tokens are random strings; only their SHA-256 hash is stored (`user_sessions`). Access tokens
are not revoked server-side and simply expire. The JWT strategy reloads `role` and `isEmailVerified`
from the database on every request, so changes apply without logging in again.

### Roles

| Role  | Can do                                                                                 |
| ----- | -------------------------------------------------------------------------------------- |
| Admin | manage users and destinations, any offer/booking, all notifications, analytics         |
| Agent | create offers, update/delete own offers, see bookings and notifications for own offers |
| User  | search offers, favorites, own bookings, own profile and notifications                  |

No token → **401**. A valid token with the wrong role, or someone else's resource → **403**
(Admin bypasses ownership checks). Catalog reads (`GET` destinations/offers) are public.

## Client profile

`User` is the **account**: credentials, role, email verification. `ClientProfile` is **customer
information**: first/last name, phone, preferred currency (`BYN` | `USD` | `EUR`, default `BYN`).
They are separate entities (1:1) because changing a phone number or a currency is not a change of the
account, and it keeps credentials out of profile endpoints.

- `GET /api/v2/users/:userId/profile`, `PATCH /api/v2/users/:userId/profile` (self or Admin).
- PATCH is partial; `null` clears a field; an empty body is 400.
- Users registered via v1 have no profile (404); v2 registration always creates one.

## Bookings

### Status lifecycle (State pattern)

Transitions are encapsulated in `src/modules/v1/bookings/states/booking-state.ts`: each status is a
state object that knows its allowed targets, so services contain no transition `if` chains.

| From \ To   | pending | confirmed | completed | cancelled |
| ----------- | :-----: | :-------: | :-------: | :-------: |
| `pending`   |    -    |    yes    |     -     |    yes    |
| `confirmed` |    -    |     -     |    yes    |    yes    |
| `completed` |    -    |     -     |     -     |    yes    |
| `cancelled` |    -    |     -     |     -     |     -     |

An illegal transition returns **409 Conflict** in v2 (`PATCH /api/v2/bookings/:id/status`).
The booking owner or an Admin can change the status. Every lifecycle event (create, status change,
cancellation) is logged by `BookingsService`.

### Idempotency-Key (v2)

`POST /api/v2/bookings` requires an `Idempotency-Key` header (UUID v4, generated by the client).

- The server stores the key with a SHA-256 hash of the body and the booking id for 24 hours
  (`idempotency_keys`, unique per user + key).
- Same key, same body → **409** with the existing booking id in `details.bookingId`.
- Same key, different body → **409**.
- Two concurrent requests with the same key: the database unique index lets only one insert win; the
  loser's unique violation is caught and answered with the same 409, so exactly one booking is created.

### Status migration: `draft` → `pending`

Stage I used `draft | confirmed | cancelled`. Stage II uses `pending | confirmed | completed | cancelled`.
Migration `20261102173000_add_stage2_schema` recreates the `BookingStatus` enum and rewrites existing
`draft` rows to `pending`; the column default became `pending`.

v1 contract after the migration (deviation from spec 3.0, see below):

- v1 responses and filters use `pending | confirmed | cancelled`;
- a `completed` booking is shown as `confirmed` in v1 (v1 has no `completed`);
- illegal transitions in v1 keep returning 400, as in stage I.

## Notifications

Outbox pattern: a status change and its notifications are written in **one transaction**; sending
happens later in the background, never inside the HTTP request.

- On every successful booking status change two records are created: `email` / `pending` (for the
  worker) and `in_app` / `sent` (an in-app notification is delivered by being stored).
- Registration and resend-verification create an `email_verification` email.
- `NotificationsWorker` (`@Interval`, every 10 s) takes up to 20 pending emails and sends them through
  SMTP (Mailhog): success → `sent` + `sentAt`, failure → `failed` + `errorMessage`. One failed email
  does not block the rest of the batch; overlapping runs are skipped.
- `GET /api/v2/notifications?page&limit&type&status` returns **in-app** notifications only (email
  payloads may contain a verification token). User: own; Agent: for bookings of own offers; Admin: all.

## Analytics (Admin)

`GET /api/v2/analytics/bookings?from=2026-11-01&to=2026-11-30&groupBy=destination&limit=10`

- `from`, `to`: required dates (`YYYY-MM-DD`), both inclusive; counts bookings **created** in the period.
- `groupBy`: `status` (all four statuses, zeros included) or `destination` (sorted by count, desc).
- `limit`: 1-100, default 10.

```json
{
  "groupBy": "destination",
  "from": "2026-11-01",
  "to": "2026-11-30",
  "data": [{ "key": "<destinationId>", "label": "Paris", "count": 12 }]
}
```

## Testing

```bash
pnpm test        # unit tests (Vitest), no database needed
pnpm test:cov    # coverage of services, State and workers; fails below 60%
pnpm test:int    # integration tests: real AppModule + PostgreSQL
```

Integration tests (`src/tests/integration/**/*.int-spec.ts`) cover `/api/v2/sessions` and
`/api/v2/bookings` over HTTP (supertest). They need `docker compose up -d` and use a separate database,
`travel_platform_test`, which is created and migrated automatically. Every test starts from an empty
database. To protect real data, the suite refuses to run against any database whose name does not end
with `_test`. SMTP is mocked and the notifications worker is disabled in these tests.

## Other commands

```bash
pnpm build                      # compile to dist/
pnpm lint / pnpm lint:fix       # oxlint
pnpm format / pnpm format:check # oxfmt
pnpm exec tsc --noEmit          # type check
pnpm prisma:generate            # regenerate the Prisma client into prisma/generated
npx prisma migrate dev --name <name>
```

When upgrading Prisma, keep `@prisma/client` and `@prisma/client-runtime-utils` on the same version:
the generated client in `prisma/generated` imports the latter directly.

## Deviations from the specification

| Spec                                   | Implementation                        | Reason                                               |
| -------------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| v1 contract unchanged (`draft` status) | v1 uses `pending`                     | one status vocabulary across v1, v2 and the database |
| Repository layer (stage I)             | Services use `PrismaService` directly | the stage I code never had repositories              |
| Jest                                   | Vitest                                | already used in stage I; Jest-compatible API         |
| 403 when deleting someone else's offer | 409 Conflict                          | existing behavior kept by decision                   |
