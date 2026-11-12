import { execSync } from "node:child_process";
import { Client } from "pg";
import { TEST_DATABASE_URL, assertTestDatabaseName, getDatabaseName } from "./test-database";

// Runs once before all integration test files: creates the test database and applies migrations.
export default async function globalSetup(): Promise<void> {
  const databaseName = getDatabaseName(TEST_DATABASE_URL);
  assertTestDatabaseName(databaseName);

  const maintenanceUrl = new URL(TEST_DATABASE_URL);
  maintenanceUrl.pathname = "/postgres";

  const client = new Client({ connectionString: maintenanceUrl.toString() });
  await client.connect();

  try {
    const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [
      databaseName,
    ]);

    if (!rowCount) {
      // Identifiers cannot be query parameters; the name is validated by assertTestDatabaseName.
      // template0 has no recorded collation version, unlike template1 in a volume created by a
      // glibc-based image and now served by postgres:alpine (musl) - CREATE from template1 fails.
      await client.query(`CREATE DATABASE "${databaseName}" TEMPLATE template0`);
    }
  } finally {
    await client.end();
  }

  execSync("pnpm exec prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
}
