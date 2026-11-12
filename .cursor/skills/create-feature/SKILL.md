---
name: create-feature
description: Create a complete NestJS feature following this project's module, controller, service, Zod, Prisma, Swagger and Vitest conventions.
---

# Create Feature

Use this skill when implementing a new feature or resource.

## Step 1 — Inspect

Before writing code:

1. Inspect `apps/travel-platform-api/src/modules`.
2. Find at least one existing feature with similar responsibilities.
3. Read its:
   - module
   - controller
   - service
   - models
   - Zod schemas
   - Swagger DTOs
   - tests
4. Inspect related Prisma models.
5. Inspect relevant shared infrastructure.

Do not implement the feature before understanding these patterns.

## Step 2 — Define the feature boundary

Determine which files are actually required.

A normal feature may contain:

```text
feature/
├── feature.module.ts
├── feature.controller.ts
├── feature.service.ts
├── models/
└── schemas/
```

Do not create repositories, use-cases, mappers or additional layers unless the existing project already uses them for the same problem.

## Step 3 — Database

If no Prisma schema change is required, do not modify Prisma.

If a schema change is required:

Modify schema.prisma.
Create a new Prisma migration.
Regenerate Prisma Client if required.
Update affected services.
Update affected tests.

Never modify an existing applied migration.

## Step 4 — Schemas

Create Zod schemas for API input.

Infer TypeScript types:

export type CreateExampleDto = z.infer<typeof createExampleSchema>;

Create response schemas when the endpoint exposes a response contract.

Do not use Prisma model types as API DTOs.

## Step 5 — Service

Implement business logic in the service.

Database access must go through PrismaService.

Map database entities to response DTOs.

Do not return sensitive database fields.

Use appropriate NestJS exceptions.

## Step 6 — Controller

Keep the controller thin.

Use:

NestJS route decorators
existing AuthGuard when required
CurrentUser when required
ZodValidationPipe
Swagger decorators

Do not duplicate service logic.

## Step 7 — Swagger

Follow the existing Swagger DTO pattern.

For each endpoint document the appropriate:

operation
parameters
request body
successful response
relevant error responses
authentication requirement

Do not invent a new Swagger convention.

## Step 8 — Tests

Add tests following testing.mdc.

For services:

use Prisma mocks
verify relevant Prisma calls
test successful behavior
test expected exceptions
test important business rules

For controllers:

mock the service
verify service arguments
verify returned values
test controller-level authorization

Use Faker according to the existing test conventions.

## Step 9 — Verification

After implementation:

Run typecheck.
Run lint.
Run relevant tests.
Run the complete test suite when appropriate.

Do not disable lint rules or weaken tests to make the implementation pass.

## Step 10 — Final review

Before finishing, verify:

correct module location
correct API version
controller contains no business logic
Prisma is not accessed from controller
Zod validation is used
response DTO is respected
sensitive fields are excluded
Swagger is documented
tests are present
unrelated code was not modified
