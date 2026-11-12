import { type INestApplication } from "@nestjs/common";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { createTestApp } from "./helpers/test-app";
import { getPrisma, resetDatabase } from "./helpers/database";
import { createUser } from "./helpers/factories";
import { assertTestDatabaseName } from "./setup/test-database";

describe("Integration test infrastructure", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("is connected to the test database", async () => {
    const [{ name }] = await getPrisma(app).$queryRaw<
      { name: string }[]
    >`SELECT current_database() AS name`;

    expect(name).toBe("travel_platform_test");
  });

  it("refuses database names without the _test suffix", () => {
    expect(() => assertTestDatabaseName("travel_platform")).toThrow(/Refusing to run/);
  });

  it("creates users via the factory and wipes them with resetDatabase", async () => {
    const user = await createUser(app, { isEmailVerified: false });

    expect(await getPrisma(app).user.count({ where: { id: user.id } })).toBe(1);

    await resetDatabase(app);

    expect(await getPrisma(app).user.count()).toBe(0);
  });
});
