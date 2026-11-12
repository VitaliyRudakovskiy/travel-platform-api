import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UserRole } from "#prisma";
import { type AuthenticatedUser } from "@shared/auth/authenticated-user";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { provideMailService } from "@tests/providers/provide-mail-service";
import { mailServiceMock } from "@tests/mocks/mail-service.mock";
import { notificationMock } from "@tests/mocks/notification.mock";
import { userMock } from "@tests/mocks/user.mock";
import { NotificationsService } from "./notifications.service";

const asUser = (role: UserRole): AuthenticatedUser =>
  ({ ...userMock, role, isEmailVerified: true }) as unknown as AuthenticatedUser;

describe("NotificationsService", () => {
  let service: NotificationsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, providePrisma(), provideMailService()],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    const query = { page: 1, limit: 10 };

    beforeEach(() => {
      prismaServiceMock.notification.count.mockResolvedValue(1);
      prismaServiceMock.notification.findMany.mockResolvedValue([notificationMock]);
    });

    it("returns only the user's own in-app notifications for a User", async () => {
      const result = await service.findAll(query, asUser(UserRole.User));

      expect(prismaServiceMock.notification.findMany).toHaveBeenCalledWith({
        where: { userId: userMock.id, channel: "in_app" },
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual({
        data: [notificationMock],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });

    it("scopes an Agent to notifications for bookings of their offers", async () => {
      await service.findAll(query, asUser(UserRole.Agent));

      expect(prismaServiceMock.notification.count).toHaveBeenCalledWith({
        where: { booking: { offer: { ownerId: userMock.id } }, channel: "in_app" },
      });
    });

    it("does not restrict an Admin to any user", async () => {
      await service.findAll(query, asUser(UserRole.Admin));

      expect(prismaServiceMock.notification.count).toHaveBeenCalledWith({
        where: { channel: "in_app" },
      });
    });

    it("applies type and status filters and pagination", async () => {
      prismaServiceMock.notification.count.mockResolvedValue(25);

      const result = await service.findAll(
        { page: 2, limit: 10, type: "booking_cancelled", status: "sent" },
        asUser(UserRole.User),
      );

      expect(prismaServiceMock.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: userMock.id,
          channel: "in_app",
          type: "booking_cancelled",
          status: "sent",
        },
        skip: 10,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });
  });

  describe("sendPendingEmails", () => {
    const email = "traveller@example.com";
    const bookingId = faker.string.uuid();
    const bookingEmail = {
      ...notificationMock,
      id: faker.string.uuid(),
      channel: "email",
      status: "pending",
      sentAt: null,
      payload: { bookingId },
      user: { email },
    };
    const verificationEmail = {
      ...bookingEmail,
      id: faker.string.uuid(),
      type: "email_verification",
      bookingId: null,
      payload: { token: "verification-token" },
    };

    it("sends pending emails and marks them as sent", async () => {
      prismaServiceMock.notification.findMany.mockResolvedValue([bookingEmail]);
      mailServiceMock.send.mockResolvedValue(undefined);

      const result = await service.sendPendingEmails();

      expect(prismaServiceMock.notification.findMany).toHaveBeenCalledWith({
        where: { status: "pending", channel: "email" },
        orderBy: { createdAt: "asc" },
        take: 20,
        include: { user: { select: { email: true } } },
      });
      expect(mailServiceMock.send).toHaveBeenCalledWith(
        email,
        "Your booking is confirmed",
        `Your booking ${bookingId} has been confirmed.`,
      );
      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith({
        where: { id: bookingEmail.id },
        data: { status: "sent", sentAt: expect.any(Date) },
      });
      expect(result).toEqual({ sent: 1, failed: 0 });
    });

    it("puts the verification token into the email text", async () => {
      prismaServiceMock.notification.findMany.mockResolvedValue([verificationEmail]);
      mailServiceMock.send.mockResolvedValue(undefined);

      await service.sendPendingEmails();

      expect(mailServiceMock.send).toHaveBeenCalledWith(
        email,
        "Confirm your email",
        expect.stringContaining("verification-token"),
      );
    });

    it("marks a notification as failed and continues with the rest of the batch", async () => {
      prismaServiceMock.notification.findMany.mockResolvedValue([verificationEmail, bookingEmail]);
      mailServiceMock.send
        .mockRejectedValueOnce(new Error("SMTP connection refused"))
        .mockResolvedValueOnce(undefined);

      const result = await service.sendPendingEmails();

      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith({
        where: { id: verificationEmail.id },
        data: { status: "failed", errorMessage: "SMTP connection refused" },
      });
      expect(prismaServiceMock.notification.update).toHaveBeenCalledWith({
        where: { id: bookingEmail.id },
        data: { status: "sent", sentAt: expect.any(Date) },
      });
      expect(result).toEqual({ sent: 1, failed: 1 });
    });

    it("does nothing when there are no pending emails", async () => {
      prismaServiceMock.notification.findMany.mockResolvedValue([]);

      const result = await service.sendPendingEmails();

      expect(mailServiceMock.send).not.toHaveBeenCalled();
      expect(prismaServiceMock.notification.update).not.toHaveBeenCalled();
      expect(result).toEqual({ sent: 0, failed: 0 });
    });
  });
});
