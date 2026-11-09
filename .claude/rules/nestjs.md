---
paths:
  - "src/**/*.ts"
---

# NestJS Conventions

## Modules

Use standard NestJS modules. Feature modules declare their required controllers, providers, imports and exports. Follow existing module definitions before changing provider registration.

## Controllers

Controllers must stay thin:

1. Receive HTTP input.
2. Apply guards and validation.
3. Call the appropriate service method.
4. Return the service result.

No business logic in controllers.

Simple access-control checks that depend directly on the authenticated request context may stay in controllers when that matches the existing pattern (e.g. checking that the requested `userId` matches `CurrentUser.id`). Do not move such logic into a new abstraction without a concrete need.

## Validation

Use the existing `ZodValidationPipe`:

```ts
@Body(new ZodValidationPipe(schema))
```

or the equivalent used by the surrounding code. Do not duplicate schema validation manually inside controllers.

## Authentication

Follow the auth mechanism of the API version you are working in:

- **v1:** `AuthGuard` (`@shared/guards/auth.guard`) — `X-User-Id` header.
- **v2:** `JwtAuthGuard` (passport-jwt), plus `RolesGuard` with `@Roles()` and `EmailVerifiedGuard` where required.

Use `@CurrentUser()` to get the `AuthenticatedUser`. Do not add JWT to v1 or change auth mechanisms unless explicitly requested. Auth changes must preserve the controller/service architecture.

## Responses

Controller methods return typed response DTOs. Prefer explicit return types for public controller and service methods.

## Swagger

Public endpoints follow the existing Swagger conventions. Keep Swagger DTO classes (`schemas/swagger/`) separate from Zod API schemas. Do not replace the Swagger approach with automatic schema generation unless explicitly requested.

## Exceptions

Use NestJS HTTP exceptions. Do not use Express `Response` directly for normal endpoint responses. Do not manually construct success/error HTTP responses.

## Dependency injection

Use NestJS constructor dependency injection. Do not instantiate providers manually.

## Imports

Use the established aliases: `@shared/*`, `@services/*`, `@pipes/*`, `@modules/*`, `@tests/*`, `#prisma`. Do not introduce a new alias when an existing one fits.
