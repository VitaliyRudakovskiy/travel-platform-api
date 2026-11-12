import { createHash } from "node:crypto";
import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { Prisma, UserRole } from "#prisma";
import { BookingsService } from "./bookings.service";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { bookingMock } from "@tests/mocks/booking.mock";
import { offerMock } from "@tests/mocks/offer.mock";
import { userMock } from "@tests/mocks/user.mock";

describe("BookingsService", () => {
  let service: BookingsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService, providePrisma()],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getMyBookings", () => {
    const userId = faker.string.uuid();
    const query = { page: 1, limit: 10 };

    it("returns a paginated list of bookings for the user", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.booking.count.mockResolvedValue(1);
      prismaServiceMock.booking.findMany.mockResolvedValue([bookingMock]);

      const result = await service.getMyBookings(query, userId);

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaServiceMock.booking.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
      expect(result).toEqual({
        data: [
          {
            ...bookingMock,
            status: "pending",
            totalPrice: bookingMock.totalPrice.toNumber(),
            offer: {
              ...bookingMock.offer,
              price: bookingMock.offer.price.toNumber(),
            },
          },
        ],
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

    it("filters by status", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.findMany.mockResolvedValue([]);

      await service.getMyBookings({ ...query, status: "confirmed" }, userId);

      expect(prismaServiceMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId, status: "confirmed" } }),
      );
    });

    it("filters by pending status", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.findMany.mockResolvedValue([]);

      await service.getMyBookings({ ...query, status: "pending" }, userId);

      expect(prismaServiceMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId, status: "pending" } }),
      );
    });

    it("returns bookings of the agent's offers", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.findMany.mockResolvedValue([]);

      await service.getMyBookings(query, userId, UserRole.Agent);

      expect(prismaServiceMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { offer: { ownerId: userId } } }),
      );
    });

    it("returns all bookings for an Admin", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.findMany.mockResolvedValue([]);

      await service.getMyBookings(query, userId, UserRole.Admin);

      expect(prismaServiceMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it("throws NotFoundException when user is not found", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getMyBookings(query, userId)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.booking.findMany).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("returns the booking when owned by the user", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      const result = await service.getById(bookingMock.id, bookingMock.userId);

      expect(prismaServiceMock.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingMock.id },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
      expect(result).toEqual({
        ...bookingMock,
        status: "pending",
        totalPrice: bookingMock.totalPrice.toNumber(),
        offer: {
          ...bookingMock.offer,
          price: bookingMock.offer.price.toNumber(),
        },
      });
    });

    it("throws NotFoundException when booking is not found", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(null);

      await expect(service.getById(bookingMock.id, bookingMock.userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("throws ForbiddenException when booking belongs to another user", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      await expect(service.getById(bookingMock.id, faker.string.uuid())).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("returns the booking when the user is Admin", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      const result = await service.getById(bookingMock.id, faker.string.uuid(), UserRole.Admin);

      expect(result.id).toBe(bookingMock.id);
    });

    it("returns the booking when the user is the offer Agent", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      const result = await service.getById(
        bookingMock.id,
        bookingMock.offer.ownerId,
        UserRole.Agent,
      );

      expect(result.id).toBe(bookingMock.id);
    });

    it("throws ForbiddenException when an Agent does not own the offer", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      await expect(
        service.getById(bookingMock.id, faker.string.uuid(), UserRole.Agent),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("create", () => {
    const userId = faker.string.uuid();
    const createBookingDto = {
      offerId: faker.string.uuid(),
      startDate: "2026-06-01T00:00:00.000Z",
      endDate: "2026-06-05T00:00:00.000Z",
      guestsCount: 2,
    };
    const activeOffer = {
      ...offerMock,
      id: createBookingDto.offerId,
      availableFrom: new Date("2026-01-01T00:00:00.000Z"),
      availableTo: new Date("2026-12-31T00:00:00.000Z"),
      price: { toNumber: () => 100 },
      maxGuests: 4,
      maxConcurrentBookings: 2,
    };

    it("creates a pending booking with computed total price", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.create.mockResolvedValue(bookingMock);

      const result = await service.create(createBookingDto, userId);

      expect(prismaServiceMock.offer.findFirst).toHaveBeenCalledWith({
        where: {
          id: createBookingDto.offerId,
          status: "active",
          deletedAt: null,
        },
      });
      expect(prismaServiceMock.booking.create).toHaveBeenCalledWith({
        data: {
          userId,
          offerId: createBookingDto.offerId,
          startDate: new Date(createBookingDto.startDate),
          endDate: new Date(createBookingDto.endDate),
          guestsCount: createBookingDto.guestsCount,
          totalPrice: 800,
          status: "pending",
        },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
      expect(result).toEqual({
        ...bookingMock,
        status: "pending",
        totalPrice: bookingMock.totalPrice.toNumber(),
        offer: {
          ...bookingMock.offer,
          price: bookingMock.offer.price.toNumber(),
          destination: {
            ...bookingMock.offer.destination,
          },
        },
      });
    });

    it("throws NotFoundException when offer is not active", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(null);

      await expect(service.create(createBookingDto, userId)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.booking.create).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when end date is not after start date", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);

      await expect(
        service.create(
          {
            ...createBookingDto,
            startDate: "2026-06-05T00:00:00.000Z",
            endDate: "2026-06-01T00:00:00.000Z",
          },
          userId,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.booking.create).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when dates are outside availability", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);

      await expect(
        service.create(
          {
            ...createBookingDto,
            startDate: "2025-06-01T00:00:00.000Z",
            endDate: "2025-06-05T00:00:00.000Z",
          },
          userId,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.booking.create).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when guests count exceeds maximum", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);

      await expect(
        service.create({ ...createBookingDto, guestsCount: 10 }, userId),
      ).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.booking.create).not.toHaveBeenCalled();
    });

    it("throws ConflictException when max concurrent bookings reached", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(2);

      await expect(service.create(createBookingDto, userId)).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.booking.create).not.toHaveBeenCalled();
    });
  });

  describe("lifecycle logging", () => {
    let logSpy: ReturnType<typeof vi.spyOn>;
    const activeOffer = {
      ...offerMock,
      availableFrom: new Date("2020-01-01T00:00:00.000Z"),
      availableTo: new Date("2030-12-31T00:00:00.000Z"),
      price: { toNumber: () => 100 },
      maxGuests: 4,
      maxConcurrentBookings: 2,
    };

    beforeEach(() => {
      logSpy = vi.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
      prismaServiceMock.$transaction.mockImplementation(
        async (callback: (tx: unknown) => unknown) => callback(prismaServiceMock),
      );
    });

    afterEach(() => {
      logSpy.mockRestore();
    });

    it("logs booking creation", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.create.mockResolvedValue(bookingMock);

      await service.create(
        {
          offerId: bookingMock.offerId,
          startDate: "2026-06-01T00:00:00.000Z",
          endDate: "2026-06-05T00:00:00.000Z",
          guestsCount: 2,
        },
        bookingMock.userId,
      );

      expect(logSpy).toHaveBeenCalledWith(
        `Booking ${bookingMock.id} created: user=${bookingMock.userId} offer=${bookingMock.offerId} status=pending`,
      );
    });

    it("logs a status change", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.update.mockResolvedValue({ ...bookingMock, status: "confirmed" });

      await service.changeStatus(bookingMock.id, { status: "confirmed" }, bookingMock.userId);

      expect(logSpy).toHaveBeenCalledWith(
        `Booking ${bookingMock.id} status changed: pending -> confirmed by user=${bookingMock.userId}`,
      );
    });

    it("logs a cancellation separately", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      prismaServiceMock.booking.update.mockResolvedValue({ ...bookingMock, status: "cancelled" });

      await service.updateStatus(bookingMock.id, { status: "cancelled" }, bookingMock.userId);

      expect(logSpy).toHaveBeenCalledWith(
        `Booking ${bookingMock.id} cancelled: pending -> cancelled by user=${bookingMock.userId}`,
      );
    });

    it("does not log when the transition is rejected", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      await expect(
        service.changeStatus(bookingMock.id, { status: "completed" }, bookingMock.userId),
      ).rejects.toThrow(ConflictException);

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe("updateStatus", () => {
    const userId = bookingMock.userId;
    const activeOffer = {
      ...offerMock,
      availableFrom: new Date("2020-01-01T00:00:00.000Z"),
      availableTo: new Date("2030-12-31T00:00:00.000Z"),
      maxConcurrentBookings: 2,
    };

    it("confirms a pending booking", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      const confirmedBooking = { ...bookingMock, status: "confirmed" };
      prismaServiceMock.booking.update.mockResolvedValue(confirmedBooking);

      const result = await service.updateStatus(bookingMock.id, { status: "confirmed" }, userId);

      expect(prismaServiceMock.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingMock.id },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
      expect(prismaServiceMock.booking.update).toHaveBeenCalledWith({
        where: { id: bookingMock.id },
        data: { status: "confirmed" },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
      expect(result).toEqual({
        ...confirmedBooking,
        totalPrice: confirmedBooking.totalPrice.toNumber(),
        offer: {
          ...confirmedBooking.offer,
          price: confirmedBooking.offer.price.toNumber(),
        },
      });
    });

    it("cancels a pending booking", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      const cancelledBooking = { ...bookingMock, status: "cancelled" };
      prismaServiceMock.booking.update.mockResolvedValue(cancelledBooking);

      await service.updateStatus(bookingMock.id, { status: "cancelled" }, userId);

      expect(prismaServiceMock.booking.update).toHaveBeenCalledWith({
        where: { id: bookingMock.id },
        data: { status: "cancelled" },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
    });

    it("throws NotFoundException when booking is not found", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus(bookingMock.id, { status: "confirmed" }, userId),
      ).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });

    it("throws ForbiddenException when booking belongs to another user", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      await expect(
        service.updateStatus(bookingMock.id, { status: "confirmed" }, faker.string.uuid()),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });

    it("cancels a booking when the user is Admin", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      const cancelledBooking = { ...bookingMock, status: "cancelled" };
      prismaServiceMock.booking.update.mockResolvedValue(cancelledBooking);

      await service.updateStatus(
        bookingMock.id,
        { status: "cancelled" },
        faker.string.uuid(),
        UserRole.Admin,
      );

      expect(prismaServiceMock.booking.update).toHaveBeenCalledWith({
        where: { id: bookingMock.id },
        data: { status: "cancelled" },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
    });

    it("throws ForbiddenException when an Agent tries to update a customer's booking", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      await expect(
        service.updateStatus(
          bookingMock.id,
          { status: "cancelled" },
          bookingMock.offer.ownerId,
          UserRole.Agent,
        ),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when confirming an already confirmed booking", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue({
        ...bookingMock,
        status: "confirmed",
      });

      await expect(
        service.updateStatus(bookingMock.id, { status: "confirmed" }, userId),
      ).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when cancelling an already cancelled booking", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue({
        ...bookingMock,
        status: "cancelled",
      });

      await expect(
        service.updateStatus(bookingMock.id, { status: "cancelled" }, userId),
      ).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the offer is no longer active", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      prismaServiceMock.offer.findFirst.mockResolvedValue(null);

      await expect(
        service.updateStatus(bookingMock.id, { status: "confirmed" }, userId),
      ).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });

    it("throws ConflictException when dates are outside availability", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      prismaServiceMock.offer.findFirst.mockResolvedValue({
        ...activeOffer,
        availableFrom: new Date("2031-01-01T00:00:00.000Z"),
        availableTo: new Date("2032-12-31T00:00:00.000Z"),
      });

      await expect(
        service.updateStatus(bookingMock.id, { status: "confirmed" }, userId),
      ).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });

    it("throws ConflictException when max concurrent bookings reached", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(2);

      await expect(
        service.updateStatus(bookingMock.id, { status: "confirmed" }, userId),
      ).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
    });
  });

  describe("changeStatus", () => {
    const userId = bookingMock.userId;

    beforeEach(() => {
      prismaServiceMock.$transaction.mockImplementation(
        async (callback: (tx: unknown) => unknown) => callback(prismaServiceMock),
      );
    });

    it("completes a confirmed booking and creates email and in-app notifications", async () => {
      const confirmedBooking = { ...bookingMock, status: "confirmed" };
      const completedBooking = { ...bookingMock, status: "completed" };
      prismaServiceMock.booking.findUnique.mockResolvedValue(confirmedBooking);
      prismaServiceMock.booking.update.mockResolvedValue(completedBooking);
      prismaServiceMock.notification.createMany.mockResolvedValue({ count: 2 });

      const result = await service.changeStatus(bookingMock.id, { status: "completed" }, userId);

      expect(prismaServiceMock.booking.update).toHaveBeenCalledWith({
        where: { id: bookingMock.id },
        data: { status: "completed" },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });
      expect(prismaServiceMock.notification.createMany).toHaveBeenCalledWith({
        data: [
          {
            userId: bookingMock.userId,
            bookingId: bookingMock.id,
            type: "booking_completed",
            payload: { bookingId: bookingMock.id },
            channel: "email",
            status: "pending",
          },
          {
            userId: bookingMock.userId,
            bookingId: bookingMock.id,
            type: "booking_completed",
            payload: { bookingId: bookingMock.id },
            channel: "in_app",
            status: "sent",
            sentAt: expect.any(Date),
          },
        ],
      });
      expect(result.status).toBe("completed");
    });

    it("throws ConflictException for an illegal transition", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingMock);

      await expect(
        service.changeStatus(bookingMock.id, { status: "completed" }, userId),
      ).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.booking.update).not.toHaveBeenCalled();
      expect(prismaServiceMock.notification.createMany).not.toHaveBeenCalled();
    });
  });

  describe("create with idempotency", () => {
    const userId = faker.string.uuid();
    const createBookingDto = {
      offerId: faker.string.uuid(),
      startDate: "2026-06-01T00:00:00.000Z",
      endDate: "2026-06-05T00:00:00.000Z",
      guestsCount: 2,
    };
    const idempotencyKey = faker.string.uuid();
    const activeOffer = {
      ...offerMock,
      id: createBookingDto.offerId,
      availableFrom: new Date("2026-01-01T00:00:00.000Z"),
      availableTo: new Date("2026-12-31T00:00:00.000Z"),
      price: { toNumber: () => 100 },
      maxGuests: 4,
      maxConcurrentBookings: 2,
    };

    it("stores the idempotency key with the created booking", async () => {
      prismaServiceMock.idempotencyKey.findUnique.mockResolvedValue(null);
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.create.mockResolvedValue(bookingMock);
      prismaServiceMock.idempotencyKey.create.mockResolvedValue({});
      prismaServiceMock.$transaction.mockImplementation(
        async (callback: (tx: unknown) => unknown) => callback(prismaServiceMock),
      );

      await service.create(createBookingDto, userId, idempotencyKey);

      expect(prismaServiceMock.idempotencyKey.create).toHaveBeenCalledWith({
        data: {
          key: idempotencyKey,
          requestHash: createHash("sha256").update(JSON.stringify(createBookingDto)).digest("hex"),
          userId,
          bookingId: bookingMock.id,
          expiresAt: expect.any(Date),
        },
      });
    });

    it("throws ConflictException with the booking id on same-key same-body replay", async () => {
      prismaServiceMock.idempotencyKey.findUnique.mockResolvedValue({
        id: faker.string.uuid(),
        key: idempotencyKey,
        requestHash: createHash("sha256").update(JSON.stringify(createBookingDto)).digest("hex"),
        userId,
        bookingId: bookingMock.id,
        expiresAt: faker.date.future(),
      });

      await expect(service.create(createBookingDto, userId, idempotencyKey)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaServiceMock.booking.create).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the same key is reused with a different body", async () => {
      prismaServiceMock.idempotencyKey.findUnique.mockResolvedValue({
        id: faker.string.uuid(),
        key: idempotencyKey,
        requestHash: createHash("sha256").update("other-body").digest("hex"),
        userId,
        bookingId: bookingMock.id,
        expiresAt: faker.date.future(),
      });

      await expect(service.create(createBookingDto, userId, idempotencyKey)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaServiceMock.booking.create).not.toHaveBeenCalled();
    });

    describe("when a concurrent request with the same key wins the race", () => {
      const uniqueViolation = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`user_id`,`key`)",
        { code: "P2002", clientVersion: "test" },
      );

      beforeEach(() => {
        prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
        prismaServiceMock.booking.count.mockResolvedValue(0);
        prismaServiceMock.$transaction.mockRejectedValue(uniqueViolation);
      });

      it("returns 409 with the winner's booking id instead of a 500", async () => {
        prismaServiceMock.idempotencyKey.findUnique
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({
            id: faker.string.uuid(),
            key: idempotencyKey,
            requestHash: createHash("sha256")
              .update(JSON.stringify(createBookingDto))
              .digest("hex"),
            userId,
            bookingId: bookingMock.id,
            expiresAt: faker.date.future(),
          });

        const error = await service
          .create(createBookingDto, userId, idempotencyKey)
          .catch((caught: unknown) => caught);

        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).getResponse()).toMatchObject({
          errors: { bookingId: bookingMock.id },
        });
      });

      it("rethrows the original error when the key is not found on re-check", async () => {
        prismaServiceMock.idempotencyKey.findUnique.mockResolvedValue(null);

        await expect(service.create(createBookingDto, userId, idempotencyKey)).rejects.toBe(
          uniqueViolation,
        );
      });
    });

    it("rethrows non-unique database errors unchanged", async () => {
      const dbError = new Error("connection lost");
      prismaServiceMock.idempotencyKey.findUnique.mockResolvedValue(null);
      prismaServiceMock.offer.findFirst.mockResolvedValue(activeOffer);
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.$transaction.mockRejectedValue(dbError);

      await expect(service.create(createBookingDto, userId, idempotencyKey)).rejects.toBe(dbError);
      expect(prismaServiceMock.idempotencyKey.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
