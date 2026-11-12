import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UserRole } from "@app/common";
import { type BookingEvent } from "@app/contracts";
import { providePrisma } from "../../../tests/providers/provide-prisma";
import { provideMailService } from "../../../tests/providers/provide-mail-service";
import { provideAuthClient } from "../../../tests/providers/provide-auth-client";
import { prismaServiceMock } from "../../../tests/mocks/prisma-service.mock";
import { mailServiceMock } from "../../../tests/mocks/mail-service.mock";
import { authClientMock } from "../../../tests/mocks/auth-client.mock";
import { notificationMock } from "../../../tests/mocks/notification.mock";
import { NOTIFICATIONS_BATCH_SIZE } from "./models/notification.constants";
import { NotificationsService } from "./notifications.service";

const userId = faker.string.uuid();
const agentId = faker.string.uuid();

const baseEvent = {
  eventId: faker.string.uuid(),
  bookingId: faker.string.uuid(),
  userId,
  offerId: faker.string.uuid(),
  offerOwnerId: agentId,
  occurredAt: "2026-11-12T10:00:00.000Z",
};

const createdEvent: BookingEvent = {
  ...baseEvent,
  type: "booking.created",
  offerTitle: "Weekend in Paris",
  status: "pending",
  startDate: "2026-06-01T00:00:00.000Z",
  endDate: "2026-06-03T00:00:00.000Z",
  guestsCount: 2,
  totalPrice: 900,
};

function statusChanged(
  toStatus: "confirmed" | "cancelled" | "completed" | "pending",
): BookingEvent {
  return { ...baseEvent, type: "booking.status_changed", fromStatus: "pending", toStatus };
}

function pendingEmail(overrides: Record<string, unknown> = {}) {
  return {
    ...notificationMock,
    id: faker.string.uuid(),
    userId,
    type: "booking_confirmed",
    channel: "email",
    status: "pending",
    sentAt: null,
    payload: { bookingId: baseEvent.bookingId, offerTitle: "Weekend in Paris" },
    ...overrides,
  };
}

describe("NotificationsService", () => {
  let service: NotificationsService;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, providePrisma(), provideMailService(), provideAuthClient()],
    }).compile();

    service = module.get(NotificationsService);
  });

  describe("findAll", () => {
    const query = { page: 1, limit: 10 };

    beforeEach(() => {
      prismaServiceMock.notification.count.mockResolvedValue(0);
      prismaServiceMock.notification.findMany.mockResolvedValue([]);
    });

    it.each([
      ["User: own notifications", UserRole.User, { userId }],
      ["Agent: bookings of own offers", UserRole.Agent, { offerOwnerId: userId }],
      ["Admin: everything", UserRole.Admin, {}],
    ])("scopes the list — %s — and returns in-app only", async (_case, role, scope) => {
      await service.findAll(query as never, { id: userId, role, isEmailVerified: true });

      expect(prismaServiceMock.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { ...scope, channel: "in_app" } }),
      );
    });

    it("applies type and status filters and pagination", async () => {
      prismaServiceMock.notification.count.mockResolvedValue(25);

      const result = await service.findAll(
        { page: 2, limit: 10, type: "booking_created", status: "sent" } as never,
        { id: userId, role: UserRole.User, isEmailVerified: true },
      );

      expect(prismaServiceMock.notification.findMany).toHaveBeenCalledWith({
        where: { userId, channel: "in_app", type: "booking_created", status: "sent" },
        skip: 10,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      expect(result.meta).toEqual(expect.objectContaining({ totalPages: 3, hasNextPage: true }));
    });
  });

  describe("createFromBookingEvent (idempotent consumer)", () => {
    it("creates a pending email and a sent in-app notification for booking.created", async () => {
      prismaServiceMock.notification.createMany.mockResolvedValue({ count: 2 });

      await expect(service.createFromBookingEvent(createdEvent)).resolves.toBe(2);

      const { data, skipDuplicates } = prismaServiceMock.notification.createMany.mock.calls[0][0];
      expect(skipDuplicates).toBe(true);
      expect(data).toEqual([
        expect.objectContaining({
          type: "booking_created",
          channel: "email",
          status: "pending",
          eventId: createdEvent.eventId,
          userId,
          offerOwnerId: agentId,
          bookingId: createdEvent.bookingId,
        }),
        expect.objectContaining({
          type: "booking_created",
          channel: "in_app",
          status: "sent",
          sentAt: expect.any(Date),
        }),
      ]);
    });

    it.each([
      ["confirmed", "booking_confirmed"],
      ["cancelled", "booking_cancelled"],
      ["completed", "booking_completed"],
    ] as const)("maps a transition to %s to %s", async (toStatus, type) => {
      prismaServiceMock.notification.createMany.mockResolvedValue({ count: 2 });

      await service.createFromBookingEvent(statusChanged(toStatus));

      const { data } = prismaServiceMock.notification.createMany.mock.calls[0][0];
      expect(data.map((row: { type: string }) => row.type)).toEqual([type, type]);
    });

    it("returns 0 for a redelivered event (unique eventId + channel, skipDuplicates)", async () => {
      prismaServiceMock.notification.createMany.mockResolvedValue({ count: 0 });

      await expect(service.createFromBookingEvent(createdEvent)).resolves.toBe(0);
    });

    it("ignores a transition nobody is notified about", async () => {
      await expect(service.createFromBookingEvent(statusChanged("pending"))).resolves.toBe(0);
      expect(prismaServiceMock.notification.createMany).not.toHaveBeenCalled();
    });
  });

  it("stores an email-verification email with the token and the address", async () => {
    const dto = { userId, email: "new@test.local", token: "raw-token" };

    await service.createEmailVerification(dto);

    expect(prismaServiceMock.notification.create).toHaveBeenCalledWith({
      data: {
        userId,
        type: "email_verification",
        channel: "email",
        status: "pending",
        payload: { token: "raw-token", email: "new@test.local" },
      },
    });
  });

  describe("sendPendingEmails", () => {
    it("reads pending emails oldest first, in batches", async () => {
      prismaServiceMock.notification.findMany.mockResolvedValue([]);

      await expect(service.sendPendingEmails()).resolves.toEqual({
        sent: 0,
        failed: 0,
        deferred: 0,
      });
      expect(prismaServiceMock.notification.findMany).toHaveBeenCalledWith({
        where: { status: "pending", channel: "email" },
        orderBy: { createdAt: "asc" },
        take: NOTIFICATIONS_BATCH_SIZE,
      });
    });

    it("looks the address up in auth-service (once per user) and marks the emails sent", async () => {
      const first = pendingEmail();
      const second = pendingEmail({ type: "booking_created" });
      prismaServiceMock.notification.findMany.mockResolvedValue([first, second]);
      authClientMock.getUser.mockResolvedValue({ id: userId, email: "user@travel.local" });
      mailServiceMock.send.mockResolvedValue(undefined);

      const result = await service.sendPendingEmails();

      expect(authClientMock.getUser).toHaveBeenCalledTimes(1);
      expect(mailServiceMock.send).toHaveBeenCalledWith(
        "user@travel.local",
        "Your booking is confirmed",
        expect.stringContaining('"Weekend in Paris"'),
      );
      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith({
        where: { id: first.id },
        data: { status: "sent", sentAt: expect.any(Date) },
      });
      expect(result).toEqual({ sent: 2, failed: 0, deferred: 0 });
    });

    it("sends a verification email to the address from the payload, with the token", async () => {
      prismaServiceMock.notification.findMany.mockResolvedValue([
        pendingEmail({
          type: "email_verification",
          payload: { token: "raw-token", email: "new@test.local" },
        }),
      ]);
      mailServiceMock.send.mockResolvedValue(undefined);

      await service.sendPendingEmails();

      expect(authClientMock.getUser).not.toHaveBeenCalled();
      expect(mailServiceMock.send).toHaveBeenCalledWith(
        "new@test.local",
        "Confirm your email",
        expect.stringContaining("raw-token"),
      );
    });

    it("keeps an email pending (deferred) while auth-service is unreachable", async () => {
      prismaServiceMock.notification.findMany.mockResolvedValue([pendingEmail()]);
      authClientMock.getUser.mockRejectedValue(new ServiceUnavailableException());

      await expect(service.sendPendingEmails()).resolves.toEqual({
        sent: 0,
        failed: 0,
        deferred: 1,
      });
      expect(prismaServiceMock.notification.update).not.toHaveBeenCalled();
      expect(mailServiceMock.send).not.toHaveBeenCalled();
    });

    it("fails an email whose user does not exist", async () => {
      const email = pendingEmail();
      prismaServiceMock.notification.findMany.mockResolvedValue([email]);
      authClientMock.getUser.mockRejectedValue(new NotFoundException(`User ${userId} not found`));

      await service.sendPendingEmails();

      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith({
        where: { id: email.id },
        data: { status: "failed", errorMessage: `User ${userId} not found` },
      });
    });

    it("marks an SMTP failure as failed and continues with the rest of the batch", async () => {
      const broken = pendingEmail();
      const fine = pendingEmail();
      prismaServiceMock.notification.findMany.mockResolvedValue([broken, fine]);
      authClientMock.getUser.mockResolvedValue({ id: userId, email: "user@travel.local" });
      mailServiceMock.send
        .mockRejectedValueOnce(new Error("connect ECONNREFUSED 127.0.0.1:1025"))
        .mockResolvedValueOnce(undefined);

      const result = await service.sendPendingEmails();

      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith({
        where: { id: broken.id },
        data: { status: "failed", errorMessage: "connect ECONNREFUSED 127.0.0.1:1025" },
      });
      expect(result).toEqual({ sent: 1, failed: 1, deferred: 0 });
    });

    it("stores the inner errors of an AggregateError (localhost resolves to ::1 and 127.0.0.1)", async () => {
      const email = pendingEmail();
      prismaServiceMock.notification.findMany.mockResolvedValue([email]);
      authClientMock.getUser.mockResolvedValue({ id: userId, email: "user@travel.local" });
      mailServiceMock.send.mockRejectedValue(
        new AggregateError(
          [
            new Error("connect ECONNREFUSED ::1:1025"),
            new Error("connect ECONNREFUSED 127.0.0.1:1025"),
          ],
          // Node leaves this message empty; the inner errors are what matters
          "connection failed",
        ),
      );

      await service.sendPendingEmails();

      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith({
        where: { id: email.id },
        data: {
          status: "failed",
          errorMessage: "connect ECONNREFUSED ::1:1025; connect ECONNREFUSED 127.0.0.1:1025",
        },
      });
    });
  });
});
