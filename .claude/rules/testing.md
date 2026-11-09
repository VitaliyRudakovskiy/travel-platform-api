---
paths:
  - "src/**/*.spec.ts"
  - "src/**/*.test.ts"
  - "src/tests/**/*.ts"
---

# Testing Conventions

Vitest + `@nestjs/testing` + `@faker-js/faker`.

## Test structure

`describe` blocks for the class and its methods; descriptive `it` names describing observable behavior:

```ts
describe("UsersService", () => {
  describe("getById", () => {
    it("returns the user when found", async () => {
      // ...
    });

    it("throws NotFoundException when user is not found", async () => {
      // ...
    });
  });
});
```

## NestJS testing

Use `Test.createTestingModule()` for services and controllers, with the provider factories from `src/tests/providers`:

```ts
providers: [UsersService, providePrisma()]
```

## Mocks

- Reusable mocks: `src/tests/mocks/`
- Provider factories: `src/tests/providers/`

```ts
export const provideUsersService = () => ({
  provide: UsersService,
  useValue: usersServiceMock,
});
```

Do not create ad-hoc mocks when a reusable one exists.

## Faker

Use Faker for generated test data; reusable entity mocks may use Faker. When an exact value matters to an assertion, use a local deterministic value. Test behavior must not depend on randomness.

## Mock lifecycle

```ts
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Service tests

Verify: returned data, database calls and their relevant arguments, business rules, expected exceptions, and that dependent operations are not called after a failure.

Use the project's Prisma mock (`prismaServiceMock`). Do not mock the service method being tested.

## Controller tests

Verify: correct service invocation, arguments passed to the service, returned service result, controller-level authorization behavior, expected exceptions.

Use mocked services. Do not test Prisma behavior in controller tests.

## Assertions

Prefer precise assertions:

```ts
expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
  where: { id: userMock.id },
});
```

Avoid weak assertions like `expect(result).toBeTruthy()` when the actual contract can be asserted.

## Test scope

Do not duplicate behavior already covered at another appropriate layer. Do not test private implementation details. Tests should protect behavior and important integration boundaries.
