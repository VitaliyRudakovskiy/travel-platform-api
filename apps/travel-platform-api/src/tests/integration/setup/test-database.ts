// Integration tests TRUNCATE every table. Pointing them at the dev database would wipe it,
// so every entry point checks the database name before touching anything.
const DEFAULT_TEST_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/travel_platform_test";

const TEST_DATABASE_SUFFIX = "_test";

export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? DEFAULT_TEST_DATABASE_URL;

export function getDatabaseName(databaseUrl: string): string {
  return new URL(databaseUrl).pathname.replace(/^\//, "");
}

export function assertTestDatabaseName(databaseName: string): void {
  if (!databaseName.endsWith(TEST_DATABASE_SUFFIX)) {
    throw new Error(
      `Refusing to run integration tests against "${databaseName}": ` +
        `the database name must end with "${TEST_DATABASE_SUFFIX}".`,
    );
  }
}
