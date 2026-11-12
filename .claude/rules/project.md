# Project Architecture

## Stack

NestJS, TypeScript, Prisma (PostgreSQL), Zod, Vitest, Faker, Swagger.

Follow the existing project architecture. Do not introduce a different architectural pattern unless explicitly requested.

## Architecture

Classic NestJS layering:

Controller → Service → PrismaService

Do not introduce repositories, use-cases, CQRS, Clean Architecture, DDD or additional abstraction layers unless explicitly requested.

### Controller

Responsible for HTTP concerns: routes, params, request body, validation pipes, guards, Swagger docs, calling services, returning service results.

Controllers must not:

- access Prisma directly
- contain database queries
- contain business logic
- manually construct HTTP error responses

### Service

Services contain business logic and database orchestration. They:

- use PrismaService for database access
- validate business rules
- throw appropriate NestJS HTTP exceptions
- map database entities to API response DTOs

### Database

PrismaService is the only database access dependency used by feature services. Never access Prisma from controllers.

## Project structure

Nest monorepo (stage III in progress, see `docs/stage3-plan.md`): one `package.json`, several apps and libraries.

```
apps/
├── travel-platform-api/      # stage I–II monolith, kept until all services are done
│   └── src/
│       ├── modules/{health,v1,v2}/
│       ├── shared/
│       ├── tests/
│       ├── app.module.ts
│       ├── main.ts
│       └── swagger.config.ts
├── api-gateway/              # stage III services (skeletons for now)
├── auth-service/
├── catalog-service/
├── booking-service/
└── notification-service/
libs/
└── common/                   # @app/common — infrastructure shared by all apps
```

In the monolith, versioned API features belong under `apps/travel-platform-api/src/modules/v1/` or `.../v2/`. Each feature normally contains: controller, service, module, models, schemas.

v2 controllers reuse v1 services where possible (passing v2-specific flags/params); only create a v2 service when the logic is v2-only.

## Shared code

`libs/common` contains infrastructure shared by several apps: exception filter, Zod validation pipe, paginated schema, `configureApp`. It must not depend on any app (no app DTOs, no app's Prisma client).

The monolith's `apps/travel-platform-api/src/shared` contains its own cross-feature infrastructure: auth, decorators, guards, services.

Do not move feature-specific code into `shared` or `libs/common`. Do not add code to `shared` merely to avoid duplication between two files — first verify the abstraction is genuinely cross-feature.

## API contracts

- Zod schemas define request and response contracts; DTO types are inferred from them (`z.infer`).
- Do not use Prisma-generated types as public API DTOs. Do not expose Prisma entities from controllers.
- Sensitive database fields must never be exposed (e.g. `User.passwordHash`).

## Validation

Use Zod with the existing `ZodValidationPipe`. Do not introduce `class-validator` or `class-transformer`. Validation errors go through the global exception filter.

## Error handling

Use NestJS built-in HTTP exceptions (`BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `ConflictException`).

The global exception filter formats all errors. Do not manually build the standard error response in controllers or services. Do not swallow unexpected errors.

## API versioning

URI versioning (`/api/v1`, `/api/v2`) via NestJS `enableVersioning` and `@Controller({ path, version })`. Do not introduce a second versioning mechanism.

## Code changes

Prefer the smallest change that correctly solves the task. Before implementing a feature: inspect similar existing modules, follow their structure, reuse shared infrastructure, avoid new abstractions unless necessary.

Do not refactor unrelated code. Do not change established architecture for stylistic reasons.
