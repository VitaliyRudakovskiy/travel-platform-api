import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UserRole } from "@app/common";
import { BookingsController } from "./bookings.controller";
import { provideBookingsService } from "../../../tests/providers/provide-bookings-service";
import { bookingsServiceMock } from "../../../tests/mocks/bookings-service.mock";
import { bookingMock } from "../../../tests/mocks/booking.mock";
import { providePrisma } from "../../../tests/providers/provide-prisma";

describe("BookingsController v2", () => {
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
    it("calls bookingsService.getMyBookings with native statuses", async () => {
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
        role: UserRole.User,
      } as never);

      expect(bookingsServiceMock.getMyBookings).toHaveBeenCalledWith(
        query,
        bookingMock.userId,
        UserRole.User,
        true,
      );
      expect(response).toEqual(result);
    });
  });

  describe("getById", () => {
    it("calls bookingsService.getById with native statuses", async () => {
      bookingsServiceMock.getById.mockResolvedValue(bookingMock);

      const result = await controller.getById(bookingMock.id, {
        id: bookingMock.userId,
        role: UserRole.Agent,
      } as never);

      expect(bookingsServiceMock.getById).toHaveBeenCalledWith(
        bookingMock.id,
        bookingMock.userId,
        UserRole.Agent,
        true,
      );
      expect(result).toEqual(bookingMock);
    });
  });

  describe("create", () => {
    it("calls bookingsService.create with the idempotency key", async () => {
      const createBookingDto = {
        offerId: faker.string.uuid(),
        startDate: "2026-06-01T00:00:00.000Z",
        endDate: "2026-06-05T00:00:00.000Z",
        guestsCount: 2,
      };
      const idempotencyKey = faker.string.uuid();
      bookingsServiceMock.create.mockResolvedValue(bookingMock);

      const result = await controller.create(createBookingDto, idempotencyKey, {
        id: bookingMock.userId,
        role: UserRole.User,
      } as never);

      expect(bookingsServiceMock.create).toHaveBeenCalledWith(
        createBookingDto,
        bookingMock.userId,
        idempotencyKey,
      );
      expect(result).toEqual(bookingMock);
    });
  });

  describe("updateStatus", () => {
    it("calls bookingsService.changeStatus with the current user id and role", async () => {
      const updateStatusDto = { status: "completed" as const };
      const completedBooking = { ...bookingMock, status: "completed" };
      bookingsServiceMock.changeStatus.mockResolvedValue(completedBooking);

      const result = await controller.updateStatus(bookingMock.id, updateStatusDto, {
        id: bookingMock.userId,
        role: UserRole.Admin,
      } as never);

      expect(bookingsServiceMock.changeStatus).toHaveBeenCalledWith(
        bookingMock.id,
        updateStatusDto,
        bookingMock.userId,
        UserRole.Admin,
      );
      expect(result).toEqual(completedBooking);
    });
  });
});
