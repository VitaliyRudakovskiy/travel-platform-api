import { createHash } from "node:crypto";
import { type INestApplication } from "@nestjs/common";
import request from "supertest";
import { describe, beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { createTestApp } from "./helpers/test-app";
import { getPrisma, resetDatabase } from "./helpers/database";
import { createUser, type TestUser } from "./helpers/factories";
import { bearer, login } from "./helpers/auth";

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

describe("Sessions v2 (integration)", () => {
  let app: INestApplication;
  let user: TestUser;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    user = await createUser(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  describe("POST /api/v2/sessions", () => {
    it("returns an access and a refresh token and stores only the refresh token hash", async () => {
      const response = await http()
        .post("/api/v2/sessions")
        .send({ email: user.email, password: user.password });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      const sessions = await getPrisma(app).userSession.findMany({ where: { userId: user.id } });
      expect(sessions).toHaveLength(1);
      expect(sessions[0].refreshTokenHash).toBe(sha256(response.body.refreshToken));
      expect(sessions[0].refreshTokenHash).not.toBe(response.body.refreshToken);
    });

    it("issues an access token that opens protected endpoints", async () => {
      const { accessToken } = await login(app, user);

      const response = await http()
        .get(`/api/v2/users/${user.id}`)
        .set(...bearer(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(user.id);
    });

    it("returns 401 for a wrong password and creates no session", async () => {
      const response = await http()
        .post("/api/v2/sessions")
        .send({ email: user.email, password: "WrongPassword1!" });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid credentials",
      });
      expect(await getPrisma(app).userSession.count()).toBe(0);
    });

    it("returns the same 401 for an unknown email", async () => {
      const response = await http()
        .post("/api/v2/sessions")
        .send({ email: "nobody@example.com", password: user.password });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("returns 400 in the global error format for an invalid body", async () => {
      const response = await http().post("/api/v2/sessions").send({ email: "not-an-email" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: "Bad Request",
        message: "Validation failed",
        details: expect.any(Object),
        path: "/api/v2/sessions",
        timestamp: expect.any(String),
      });
    });
  });

  describe("POST /api/v2/sessions/refresh", () => {
    it("returns a new working access token for a valid refresh token", async () => {
      const { refreshToken } = await login(app, user);

      const response = await http().post("/api/v2/sessions/refresh").send({ refreshToken });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ accessToken: expect.any(String) });

      await http()
        .get(`/api/v2/users/${user.id}`)
        .set(...bearer(response.body.accessToken))
        .expect(200);
    });

    it("returns 401 for an unknown refresh token", async () => {
      const response = await http()
        .post("/api/v2/sessions/refresh")
        .send({ refreshToken: "unknown-refresh-token" });

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/v2/sessions", () => {
    it("deletes the session, after which the refresh token is rejected", async () => {
      const { refreshToken } = await login(app, user);

      await http().delete("/api/v2/sessions").send({ refreshToken }).expect(204);

      expect(await getPrisma(app).userSession.count({ where: { userId: user.id } })).toBe(0);
      await http().post("/api/v2/sessions/refresh").send({ refreshToken }).expect(401);
    });

    it("returns 401 when logging out with an already revoked token", async () => {
      const { refreshToken } = await login(app, user);
      await http().delete("/api/v2/sessions").send({ refreshToken }).expect(204);

      const response = await http().delete("/api/v2/sessions").send({ refreshToken });

      expect(response.status).toBe(401);
    });

    it("keeps the access token valid until its TTL expires (no server-side revocation)", async () => {
      const { accessToken, refreshToken } = await login(app, user);
      await http().delete("/api/v2/sessions").send({ refreshToken }).expect(204);

      await http()
        .get(`/api/v2/users/${user.id}`)
        .set(...bearer(accessToken))
        .expect(200);
    });
  });

  describe("protected endpoints", () => {
    it("returns 401 without a token", async () => {
      await http().get(`/api/v2/users/${user.id}`).expect(401);
    });

    it("returns 401 for a malformed token", async () => {
      await http()
        .get(`/api/v2/users/${user.id}`)
        .set(...bearer("not-a-jwt"))
        .expect(401);
    });
  });
});
