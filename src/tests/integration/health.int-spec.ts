import { type INestApplication } from "@nestjs/common";
import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { createTestApp } from "./helpers/test-app";

describe("Health (integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health/ready returns 200 when the test database is reachable", async () => {
    const response = await request(app.getHttpServer()).get("/health/ready");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      info: { postgres: { status: "up" } },
    });
  });
});
