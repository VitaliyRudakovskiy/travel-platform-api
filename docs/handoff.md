# Handoff: Modsen Travel Platform — Stage II

Source: `docs/cursor-history.md` (Cursor session), cross-checked against the code on 2026-11-09.

## Goal

Implement Stage II spec on top of Stage I: everything new goes under `/api/v2/`, `/api/v1/` keeps working.
v2 = JWT (access + refresh) via Passport, roles Admin/Agent/User, ClientProfile, email verification,
booking lifecycle via State pattern, Idempotency-Key, notifications worker + Mailhog, admin analytics,
Dockerfile, README, tests (State + integration for sessions/bookings, ≥60% service coverage), health via Terminus.

## Working agreements (session rules from the user)

- **Before any code change: show the plan and wait for approval** (✅ do / ❌ skip / ✏️ adjust). No edits without explicit consent.
- Educational project (learning NestJS/backend): add short theory/rationale ("why", patterns, typical mistakes).
- User sometimes implements tasks themselves → review their code, explain what to fix and why; don't silently rewrite.
- End each answer with: **what appeared**, **what to check in Bruno** (user's HTTP client), and **DB actions** (migrations/queries to run) if schema changed.

## Decisions and why

| Decision                                                                                                                   | Why                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| No repository layer (spec mentions it, code never had it)                                                                  | Keep Controller → Service → Prisma; don't add without explicit request                                                     |
| DB enum `draft` → `pending`; **v1 contract also uses `pending`** (user's choice)                                           | Deviates from spec §3.0 (v1 should say `draft`) but simpler for learning. v1 statuses: `pending \| confirmed \| cancelled` |
| `completed` is mapped to `confirmed` in v1 responses                                                                       | v1 contract has no `completed`                                                                                             |
| v2 controllers reuse v1 services; v2 behavior via extra params (`nativeStatus`, `idempotencyKey`)                          | Spec: shared business logic in services                                                                                    |
| Refresh token = random string, only SHA-256 hash stored in `user_sessions`; logout deletes row, reuse → 401                | Token not recoverable from DB; access token lives until TTL (allowed by spec)                                              |
| JwtStrategy reloads `role` and `isEmailVerified` from DB on every request                                                  | Role/verification changes apply without re-login                                                                           |
| Email verification token: hash in `email_verifications`, raw token in `notifications.payload`                              | Worker (step 9) will put it into the email                                                                                 |
| `EmailVerifiedGuard` only on `POST /api/v2/bookings`                                                                       | It's an HTTP gate, not a booking business rule                                                                             |
| Notification created in the same transaction as status change, `status = pending` (outbox)                                 | Email is sent by the worker, not inside the HTTP request                                                                   |
| Illegal transition: v2 → 409, v1 → 400                                                                                     | v1 contract preserved                                                                                                      |
| Idempotency: SHA-256 of body + bookingId, 24h TTL, unique `(userId, key)`; same key → 409 (same body: `details.bookingId`) | Spec §3.4                                                                                                                  |
| Profile: no lazy creation — missing profile (user registered via v1) → 404                                                 | Profile created only by `POST /api/v2/users`                                                                               |
| Admin bypasses ownership checks                                                                                            | Spec §3.2                                                                                                                  |

## Done (steps of the plan)

1. **DB schema** — `client_profiles`, `email_verifications`, `user_sessions`, `notifications`, `idempotency_keys`; `User.role`, `User.isEmailVerified`; `BookingStatus = pending|confirmed|completed|cancelled` (migration rewrites `draft` → `pending`).
2. **v2 skeleton** — `src/modules/v2/*` controllers (users, sessions, destinations, offers, bookings, favorites) importing v1 modules. v2 status route: `PATCH /api/v2/bookings/:id/status` (v1: `PATCH /api/v1/bookings/status/:bookingId`).
3. **JWT** — `POST /api/v2/sessions`, `/sessions/refresh`, `DELETE /sessions` (body `{ refreshToken }`); `POST /api/v2/users` creates User + empty ClientProfile in a transaction. Env: `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN=15m`, `JWT_REFRESH_EXPIRES_IN=7d`.
4. **Roles** — `JwtAuthGuard` (401) → `RolesGuard` + `@Roles()` (403) → ownership in service (403, Admin bypass). Offers v2 POST (Admin/Agent), PATCH/DELETE (owner/Admin, soft delete). `GET /bookings`: User own, Agent bookings of own offers, Admin all (v1 GET /bookings also now filtered by userId).
5. **Email verification** — `POST /api/v2/email-verifications` (public, `{ token }` → 204), `POST /api/v2/users/:userId/email-verifications` (self/Admin, old tokens invalidated, already verified → 409, bad/expired token → 400).
6. **Profile** — `GET/PATCH /api/v2/users/:userId/profile` (self/Admin; partial PATCH, `null` resets, `{}` → 400; currency BYN|USD|EUR, default BYN).
7. **Offers v2** — covered in step 4.
8. **Bookings v2** — State transitions (`src/modules/v1/bookings/states/booking-state.ts`), `completed` status, `Idempotency-Key` header (UUID v4, else 400), Notification on each status change (`booking_confirmed|cancelled|completed`, channel email, status pending).

9. **Notifications worker + Mailhog** (done 2026-11-09, uncommitted at time of writing) — `src/modules/v2/notifications/`: `NotificationsWorker` (`@Interval(10s)`, `isRunning` guard) → `NotificationsService.sendPendingEmails()` (batch 20, `pending`+`email` → `sent`/`failed`) via `MailService` (nodemailer, `SMTP_HOST`/`SMTP_PORT`/`MAIL_FROM` with defaults localhost:1025). `GET /api/v2/notifications` returns only `in_app` (email payloads hold the verification token). New nullable `notifications.booking_id` (migration `20261109120000_add_notification_booking_id`, backfilled from payload) for the Agent scope. Booking status change now creates two notifications: `email`/`pending` + `in_app`/`sent`. Mailhog in compose (UI :8025).

## Remaining

10. **Analytics** — `GET /api/v2/analytics/bookings?from&to&groupBy=status|destination&limit=10`, Admin only (403 otherwise); destination grouping sorted desc.
11. **Wrap-up** — Dockerfile; README (v1/v2 module structure, ClientProfile separation, `draft → pending` migration); tests: State pattern (mandatory), integration for `/api/v2/sessions` and `/api/v2/bookings`, ≥60% service coverage; log booking lifecycle events (create, status change, cancel) — check whether already done.

## Open questions

- **Foreign offer DELETE returns 409** (`ConflictException` in `src/modules/v1/offers/offers.service.ts:373,395`) while v2 Swagger documents 403 and spec requires 403. Assistant offered to change it; user hasn't decided. Changing it affects v1 too.
- Spec says Jest; project uses **Vitest** — kept Vitest.
- v1 says `pending` instead of `draft` (spec §3.0 deviation) — should be documented in README.

## Known bugs / issues

- `pnpm exec tsc --noEmit` fails on pre-existing errors in `src/modules/v1/offers/offers.service.spec.ts`: fixtures use `status` as `string` instead of `"active" | "archived"`. Build (`tsconfig.build.json`) passes. Not fixed yet.
- 4 pre-existing failing tests (also fail on clean `main`): `users.service.spec.ts` ("creates a user with a hashed password", "creates a user and an empty client profile in one transaction") and `sessions.service.spec.ts` ("returns session response for valid credentials", "returns access and refresh tokens and stores a hashed refresh token") — `toHaveBeenCalledWith` mismatch. Not investigated yet.

## Testing tips (for Bruno)

- `Idempotency-Key: {{$randomUUID}}` for new bookings; fixed UUID to test replay.
- Verification token: `SELECT payload FROM notifications WHERE type = 'email_verification' AND user_id = '<id>' ORDER BY "createdAt" DESC LIMIT 1;` → `payload.token`.
- Set roles manually: `UPDATE users SET role = 'Admin' WHERE email = '...';`
