import { join } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// schema/migrations paths are resolved by Prisma relative to this file.
// Variables already present in the environment win over the .env file (dotenv never overrides).
config({ path: join(__dirname, ".env"), quiet: true });

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    // The seed command runs from the current directory: use the pnpm scripts from the repository root.
    seed: "tsx apps/auth-service/prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
