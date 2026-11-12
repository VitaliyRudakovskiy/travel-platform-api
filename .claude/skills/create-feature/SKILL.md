---
name: create-feature
description: Create a complete NestJS feature or resource following this project's module, controller, service, Zod, Prisma, Swagger and Vitest conventions. Use when implementing a new feature, resource, or endpoint group.
---

# Create Feature

## Step 1 — Inspect

Before writing code:

1. Inspect `apps/travel-platform-api/src/modules` (both `v1/` and `v2/`).
2. Find at least one existing feature with similar responsibilities.
3. Read its module, controller, service, models, Zod schemas, Swagger DTOs and tests.
4. Inspect related Prisma models in `prisma/schema/*.prisma`.
5. Inspect relevant shared infrastructure in `libs/common` (`@app/common`) and `apps/travel-platform-api/src/shared`.

Do not implement the feature before understanding these patterns.

## Step 2 — Define the feature boundary

Decide the API version (v1 or v2) and which files are actually required. A normal feature may contain:

```text
feature/
├── feature.module.ts
├── feature.controller.ts
├── feature.service.ts
├── models/
└── schemas/
    └── swagger/
```

For v2, reuse an existing v1 service when the logic is shared, rather than duplicating it.

Do not create repositories, use-cases, mappers or extra layers unless the project already uses them for the same problem.

## Step 3 — Database

If no Prisma schema change is required, do not modify Prisma.

If a schema change is required:

1. Modify the relevant file in `prisma/schema/`.
2. Create a new migration: `npx prisma migrate dev --name <descriptive_name>`.
3. Regenerate the client: `pnpm prisma:generate`.
4. Update affected services and tests.

Never modify an existing applied migration.

## Step 4 — Schemas

Create Zod schemas for API input and infer types:

```ts
export type CreateExampleDto = z.infer<typeof createExampleSchema>;
```

Create response schemas when the endpoint exposes a response contract. Do not use Prisma model types as API DTOs.

## Step 5 — Service

Implement business logic in the service. Database access goes through PrismaService. Map entities to response DTOs. Never return sensitive fields. Throw appropriate NestJS exceptions.

## Step 6 — Controller

Keep it thin. Use NestJS route decorators, the version-appropriate guard (`AuthGuard` for v1; `JwtAuthGuard` / `RolesGuard` / `EmailVerifiedGuard` for v2), `@CurrentUser()` when required, `ZodValidationPipe`, and Swagger decorators. Do not duplicate service logic.

## Step 7 — Swagger

Follow the existing Swagger DTO pattern (`schemas/swagger/`). For each endpoint document: operation, parameters, request body, successful response, relevant error responses, authentication requirement (`@ApiBearerAuth()` for v2). Do not invent a new convention.

## Step 8 — Tests

Add tests following `.claude/rules/testing.md`.

- Services: Prisma mocks, verify relevant Prisma calls, success paths, expected exceptions, business rules.
- Controllers: mock the service, verify arguments and returned values, test controller-level authorization.

Add new reusable mocks to `apps/travel-platform-api/src/tests/mocks/` and provider factories to `apps/travel-platform-api/src/tests/providers/`.

## Step 9 — Verification

Run:

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm vitest run <changed spec files>
pnpm test
```

Do not disable lint rules or weaken tests to make the implementation pass.

## Step 10 — Final review

Verify:

- correct module location and API version
- module registered in `v1.module.ts` / `v2.module.ts`
- controller contains no business logic and does not access Prisma
- Zod validation is used; response DTO is respected; sensitive fields excluded
- Swagger is documented
- tests are present
- unrelated code was not modified
