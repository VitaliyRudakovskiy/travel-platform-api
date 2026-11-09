import { TEST_DATABASE_URL, assertTestDatabaseName, getDatabaseName } from "./test-database";

// Runs in every test worker before test files are imported, i.e. before AppModule and
// PrismaService read process.env. Values set here win over .env (dotenv never overrides).
process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.JWT_SECRET = "integration-test-secret";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

assertTestDatabaseName(getDatabaseName(process.env.DATABASE_URL));
