import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { BookingsController } from "./bookings.controller";
import { provideBookingsService } from "@tests/providers/provide-bookings-service";
import { bookingsServiceMock } from "@tests/mocks/bookings-service.mock";
import { bookingMock } from "@tests/mocks/booking.mock";
import { providePrisma } from "@tests/providers/provide-prisma";

describe("BookingsController", () => {
  let controller: BookingsController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [provideBookingsService(), providePrisma()],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getMyBookings", () => {
    it("calls bookingsService.getMyBookings with the current user id", async () => {
      const query = { page: 1, limit: 10 };
      const result = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      bookingsServiceMock.getMyBookings.mockResolvedValue(result);

      const response = await controller.getMyBookings(query, {
        id: bookingMock.userId,
      } as never);

      expect(bookingsServiceMock.getMyBookings).toHaveBeenCalledWith(query, bookingMock.userId);
      expect(response).toEqual(result);
    });
  });

  describe("getById", () => {
    it("calls bookingsService.getById with the current user id", async () => {
      bookingsServiceMock.getById.mockResolvedValue(bookingMock);

      const result = await controller.getById(bookingMock.id, {
        id: bookingMock.userId,
      } as never);

      expect(bookingsServiceMock.getById).toHaveBeenCalledWith(bookingMock.id, bookingMock.userId);
      expect(result).toEqual(bookingMock);
    });
  });

  describe("create", () => {
    it("calls bookingsService.create with the current user id", async () => {
      const createBookingDto = {
        offerId: faker.string.uuid(),
        startDate: "2026-06-01T00:00:00.000Z",
        endDate: "2026-06-05T00:00:00.000Z",
        guestsCount: 2,
      };
      bookingsServiceMock.create.mockResolvedValue(bookingMock);

      const result = await controller.create(createBookingDto, {
        id: bookingMock.userId,
      } as never);

      expect(bookingsServiceMock.create).toHaveBeenCalledWith(createBookingDto, bookingMock.userId);
      expect(result).toEqual(bookingMock);
    });
  });

  describe("updateStatus", () => {
    it("calls bookingsService.updateStatus with the current user id", async () => {
      const updateStatusDto = { status: "confirmed" as const };
      const confirmedBooking = { ...bookingMock, status: "confirmed" };
      bookingsServiceMock.updateStatus.mockResolvedValue(confirmedBooking);

      const result = await controller.updateStatus(bookingMock.id, updateStatusDto, {
        id: bookingMock.userId,
      } as never);

      expect(bookingsServiceMock.updateStatus).toHaveBeenCalledWith(
        bookingMock.id,
        updateStatusDto,
        bookingMock.userId,
      );
      expect(result).toEqual(confirmedBooking);
    });
  });
});
