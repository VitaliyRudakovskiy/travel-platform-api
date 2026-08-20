import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
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
        where: {},
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
        expect.objectContaining({ where: { status: "confirmed" } }),
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

    it("creates a draft booking with computed total price", async () => {
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
          status: "draft",
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

  describe("updateStatus", () => {
    const userId = bookingMock.userId;
    const activeOffer = {
      ...offerMock,
      availableFrom: new Date("2020-01-01T00:00:00.000Z"),
      availableTo: new Date("2030-12-31T00:00:00.000Z"),
      maxConcurrentBookings: 2,
    };

    it("confirms a draft booking", async () => {
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

    it("cancels a draft booking", async () => {
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
});
