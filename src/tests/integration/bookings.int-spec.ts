import { randomUUID } from "node:crypto";
import { type INestApplication } from "@nestjs/common";
import request from "supertest";
import { describe, beforeAll, beforeEach, afterAll, it, expect } from "vitest";
import { UserRole } from "#prisma";
import { createTestApp } from "./helpers/test-app";
import { getPrisma, resetDatabase } from "./helpers/database";
import { createOffer, createUser, type TestOffer, type TestUser } from "./helpers/factories";
import { bearer, login } from "./helpers/auth";

describe("Bookings v2 (integration)", () => {
  let app: INestApplication;
  let user: TestUser;
  let accessToken: string;
  let offer: TestOffer;

  const bookingBody = () => ({
    offerId: offer.id,
    startDate: "2027-06-01T00:00:00.000Z",
    endDate: "2027-06-05T00:00:00.000Z",
    guestsCount: 2,
  });

  const http = () => request(app.getHttpServer());

  const createBooking = (token: string, body: object, key: string = randomUUID()) =>
    http()
      .post("/api/v2/bookings")
      .set(...bearer(token))
      .set("Idempotency-Key", key)
      .send(body);

  const changeStatus = (token: string, bookingId: string, status: string) =>
    http()
      .patch(`/api/v2/bookings/${bookingId}/status`)
      .set(...bearer(token))
      .send({ status });

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
    const agent = await createUser(app, { role: UserRole.Agent });
    offer = await createOffer(app, agent.id);
    user = await createUser(app);
    ({ accessToken } = await login(app, user));
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/v2/bookings", () => {
    it("returns 401 without a token", async () => {
      await http()
        .post("/api/v2/bookings")
        .set("Idempotency-Key", randomUUID())
        .send(bookingBody())
        .expect(401);
    });

    it("returns 403 when the user's email is not verified", async () => {
      const unverified = await createUser(app, { isEmailVerified: false });
      const tokens = await login(app, unverified);

      const response = await createBooking(tokens.accessToken, bookingBody());

      expect(response.status).toBe(403);
      expect(await getPrisma(app).booking.count()).toBe(0);
    });

    it("returns 400 without an Idempotency-Key header", async () => {
      await http()
        .post("/api/v2/bookings")
        .set(...bearer(accessToken))
        .send(bookingBody())
        .expect(400);
    });

    it("returns 400 when Idempotency-Key is not a UUID v4", async () => {
      const response = await createBooking(accessToken, bookingBody(), "not-a-uuid");

      expect(response.status).toBe(400);
    });

    it("creates a pending booking and stores the idempotency key", async () => {
      const key = randomUUID();

      const response = await createBooking(accessToken, bookingBody(), key);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        userId: user.id,
        offerId: offer.id,
        status: "pending",
        guestsCount: 2,
        totalPrice: 800,
      });

      const storedKey = await getPrisma(app).idempotencyKey.findFirst({ where: { key } });
      expect(storedKey).toMatchObject({ userId: user.id, bookingId: response.body.id });
    });

    it("returns 409 with the existing bookingId on a replay with the same body", async () => {
      const key = randomUUID();
      const first = await createBooking(accessToken, bookingBody(), key).expect(201);

      const replay = await createBooking(accessToken, bookingBody(), key);

      expect(replay.status).toBe(409);
      expect(replay.body.details).toEqual({ bookingId: first.body.id });
      expect(await getPrisma(app).booking.count()).toBe(1);
    });

    it("returns 409 when the same key is reused with a different body", async () => {
      const key = randomUUID();
      await createBooking(accessToken, bookingBody(), key).expect(201);

      const response = await createBooking(accessToken, { ...bookingBody(), guestsCount: 3 }, key);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "Idempotency key was already used with a different request body",
      );
      expect(await getPrisma(app).booking.count()).toBe(1);
    });

    it("lets different users use the same key independently", async () => {
      const key = randomUUID();
      const otherUser = await createUser(app);
      const otherTokens = await login(app, otherUser);

      await createBooking(accessToken, bookingBody(), key).expect(201);
      await createBooking(otherTokens.accessToken, bookingBody(), key).expect(201);

      expect(await getPrisma(app).booking.count()).toBe(2);
    });

    it("creates exactly one booking for concurrent requests with the same key", async () => {
      const key = randomUUID();

      const responses = await Promise.all([
        createBooking(accessToken, bookingBody(), key),
        createBooking(accessToken, bookingBody(), key),
      ]);

      expect(responses.map((response) => response.status).sort()).toEqual([201, 409]);
      expect(await getPrisma(app).booking.count()).toBe(1);
    });
  });

  describe("PATCH /api/v2/bookings/:id/status", () => {
    let bookingId: string;

    beforeEach(async () => {
      const response = await createBooking(accessToken, bookingBody()).expect(201);
      bookingId = response.body.id;
    });

    it("moves a booking through pending -> confirmed -> completed", async () => {
      const confirmed = await changeStatus(accessToken, bookingId, "confirmed");
      expect(confirmed.status).toBe(200);
      expect(confirmed.body.status).toBe("confirmed");

      const completed = await changeStatus(accessToken, bookingId, "completed");
      expect(completed.status).toBe(200);
      expect(completed.body.status).toBe("completed");

      const stored = await getPrisma(app).booking.findUnique({ where: { id: bookingId } });
      expect(stored?.status).toBe("completed");
    });

    it("returns 409 for an illegal transition and keeps the status", async () => {
      const response = await changeStatus(accessToken, bookingId, "completed");

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Cannot transition booking from pending to completed");

      const stored = await getPrisma(app).booking.findUnique({ where: { id: bookingId } });
      expect(stored?.status).toBe("pending");
    });

    it("creates an email (pending) and an in-app (sent) notification on a status change", async () => {
      await changeStatus(accessToken, bookingId, "confirmed").expect(200);

      const notifications = await getPrisma(app).notification.findMany({
        where: { bookingId },
        orderBy: { channel: "asc" },
      });

      expect(notifications).toEqual([
        expect.objectContaining({
          userId: user.id,
          type: "booking_confirmed",
          channel: "email",
          status: "pending",
          sentAt: null,
        }),
        expect.objectContaining({
          userId: user.id,
          type: "booking_confirmed",
          channel: "in_app",
          status: "sent",
          sentAt: expect.any(Date),
        }),
      ]);
    });

    it("creates no notification for a rejected transition", async () => {
      await changeStatus(accessToken, bookingId, "completed").expect(409);

      expect(await getPrisma(app).notification.count({ where: { bookingId } })).toBe(0);
    });

    it("returns 403 when another user changes the booking", async () => {
      const stranger = await createUser(app);
      const strangerTokens = await login(app, stranger);

      const response = await changeStatus(strangerTokens.accessToken, bookingId, "cancelled");

      expect(response.status).toBe(403);
      const stored = await getPrisma(app).booking.findUnique({ where: { id: bookingId } });
      expect(stored?.status).toBe("pending");
    });

    it("lets an Admin change someone else's booking", async () => {
      const admin = await createUser(app, { role: UserRole.Admin });
      const adminTokens = await login(app, admin);

      await changeStatus(adminTokens.accessToken, bookingId, "cancelled").expect(200);
    });

    it("returns 400 for an unknown status value", async () => {
      await changeStatus(accessToken, bookingId, "archived").expect(400);
    });
  });
});
