import { createHash } from "node:crypto";
import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UnavailabilityReason } from "@app/contracts";
import { UserRole } from "@app/common";
import { Prisma } from "#booking-prisma";
import { providePrisma } from "../../../tests/providers/provide-prisma";
import { provideCatalogClient } from "../../../tests/providers/provide-catalog-client";
import { prismaServiceMock } from "../../../tests/mocks/prisma-service.mock";
import { catalogClientMock } from "../../../tests/mocks/catalog-client.mock";
import { BookingsService } from "./bookings.service";

const userId = faker.string.uuid();
const agentId = faker.string.uuid();
const offerId = faker.string.uuid();

const offerInfo = {
  id: offerId,
  ownerId: agentId,
  title: "Weekend in Paris",
  type: "tour",
  price: "100.00",
  currency: "EUR",
  destinationId: faker.string.uuid(),
  destinationName: "Paris",
  destinationCountryCode: "FR",
  status: "active",
  maxGuests: 4,
  maxConcurrentBookings: 2,
  availableFrom: "2026-01-01T00:00:00.000Z",
  availableTo: "2027-12-31T00:00:00.000Z",
  deleted: false,
};

const offerSummary = {
  id: offerId,
  title: "Weekend in Paris",
  type: "tour",
  price: 100,
  currency: "EUR",
  destination: { id: offerInfo.destinationId, name: "Paris", countryCode: "FR" },
};

const createDto = {
  offerId,
  startDate: "2026-06-01T00:00:00.000Z",
  endDate: "2026-06-04T00:00:00.000Z",
  guestsCount: 2,
};

function bookingRow(overrides: Record<string, unknown> = {}) {
  return {
    id: faker.string.uuid(),
    userId,
    offerId,
    offerOwnerId: agentId,
    startDate: new Date(createDto.startDate),
    endDate: new Date(createDto.endDate),
    guestsCount: 2,
    totalPrice: new Prisma.Decimal(600),
    status: "pending",
    capacityReleased: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("BookingsService", () => {
  let service: BookingsService;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService, providePrisma(), provideCatalogClient()],
    }).compile();

    service = module.get(BookingsService);

    // interactive transaction: run the callback against the same mock
    prismaServiceMock.$transaction.mockImplementation(async (callback: (tx: unknown) => unknown) =>
      callback(prismaServiceMock),
    );
  });

  describe("getMyBookings", () => {
    const query = { page: 1, limit: 10 };

    it.each([
      ["User", UserRole.User, { userId }],
      ["Agent (bookings of own offers)", UserRole.Agent, { offerOwnerId: userId }],
      ["Admin", UserRole.Admin, {}],
    ])("scopes the list for %s", async (_case, role, where) => {
      prismaServiceMock.booking.count.mockResolvedValue(0);
      prismaServiceMock.booking.findMany.mockResolvedValue([]);
      catalogClientMock.getOffersByIds.mockResolvedValue(new Map());

      await service.getMyBookings(query, userId, role);

      expect(prismaServiceMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where }),
      );
    });

    it("embeds the offer summary, maps completed -> confirmed for v1 and hides internal fields", async () => {
      const booking = bookingRow({ status: "completed" });
      prismaServiceMock.booking.count.mockResolvedValue(1);
      prismaServiceMock.booking.findMany.mockResolvedValue([booking]);
      catalogClientMock.getOffersByIds.mockResolvedValue(new Map([[offerId, offerInfo]]));

      const result = await service.getMyBookings(query, userId);

      expect(result.data[0]).toEqual(
        expect.objectContaining({ status: "confirmed", totalPrice: 600, offer: offerSummary }),
      );
      expect(result.data[0]).not.toHaveProperty("offerOwnerId");
      expect(result.data[0]).not.toHaveProperty("capacityReleased");
    });

    it("returns bookings without `offer` when catalog-service is unavailable", async () => {
      prismaServiceMock.booking.count.mockResolvedValue(1);
      prismaServiceMock.booking.findMany.mockResolvedValue([bookingRow()]);
      catalogClientMock.getOffersByIds.mockRejectedValue(new ServiceUnavailableException());

      const result = await service.getMyBookings(query, userId);

      expect(result.data[0]).not.toHaveProperty("offer");
    });
  });

  describe("getById", () => {
    it("lets the offer owner (Agent) view a booking of their offer", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingRow({ userId: "someone" }));
      catalogClientMock.getOffersByIds.mockResolvedValue(new Map());

      await expect(service.getById("id", agentId, UserRole.Agent)).resolves.toBeDefined();
    });

    it("throws ForbiddenException for another user's booking", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(bookingRow({ userId: "someone" }));

      await expect(service.getById("id", userId, UserRole.User)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("throws NotFoundException for an unknown booking", async () => {
      prismaServiceMock.booking.findUnique.mockResolvedValue(null);

      await expect(service.getById("id", userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create (orchestration)", () => {
    function arrangeHappyPath() {
      catalogClientMock.getOffer.mockResolvedValue(offerInfo);
      catalogClientMock.checkAvailability.mockResolvedValue({
        available: true,
        remainingCapacity: 2,
      });
      catalogClientMock.reserve.mockResolvedValue({ remainingCapacity: 1 });
      // like Prisma: NUMERIC comes back as a Decimal
      prismaServiceMock.booking.create.mockImplementation(async ({ data }) =>
        bookingRow({ ...data, totalPrice: new Prisma.Decimal(data.totalPrice) }),
      );
      prismaServiceMock.outboxEvent.create.mockResolvedValue({});
      prismaServiceMock.idempotencyKey.create.mockResolvedValue({});
    }

    it("checks availability, reserves a slot, then writes the booking and booking.created in one transaction", async () => {
      arrangeHappyPath();

      const result = await service.create(createDto, userId);

      expect(catalogClientMock.checkAvailability).toHaveBeenCalledWith(offerId, {
        startDate: createDto.startDate,
        endDate: createDto.endDate,
        guestsCount: 2,
      });
      expect(catalogClientMock.reserve).toHaveBeenCalledWith(offerId);
      expect(prismaServiceMock.booking.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          offerId,
          offerOwnerId: agentId,
          // 3 days x 2 guests x 100
          totalPrice: 600,
          status: "pending",
        }),
      });
      expect(prismaServiceMock.outboxEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventType: "booking_created",
          payload: expect.objectContaining({
            type: "booking.created",
            offerTitle: "Weekend in Paris",
            offerOwnerId: agentId,
          }),
        }),
      });
      // reserve happens BEFORE the transaction
      expect(catalogClientMock.reserve.mock.invocationCallOrder[0]).toBeLessThan(
        prismaServiceMock.$transaction.mock.invocationCallOrder[0],
      );
      expect(catalogClientMock.release).not.toHaveBeenCalled();
      expect(result.offer).toEqual(offerSummary);
    });

    it("uses the outbox row id as the eventId of the payload", async () => {
      arrangeHappyPath();

      await service.create(createDto, userId);

      const { data } = prismaServiceMock.outboxEvent.create.mock.calls[0][0];
      expect(data.payload.eventId).toBe(data.id);
    });

    it.each([
      [UnavailabilityReason.OFFER_NOT_ACTIVE, NotFoundException],
      [UnavailabilityReason.INVALID_DATES, BadRequestException],
      [UnavailabilityReason.DATES_OUT_OF_RANGE, BadRequestException],
      [UnavailabilityReason.GUESTS_EXCEEDED, BadRequestException],
      [UnavailabilityReason.NO_CAPACITY, ConflictException],
    ])("maps unavailability %s to %s without reserving", async (reason, exception) => {
      catalogClientMock.getOffer.mockResolvedValue(offerInfo);
      catalogClientMock.checkAvailability.mockResolvedValue({
        available: false,
        remainingCapacity: 0,
        reason,
        message: "not available",
      });

      await expect(service.create(createDto, userId)).rejects.toThrow(exception);
      expect(catalogClientMock.reserve).not.toHaveBeenCalled();
    });

    it("throws NotFoundException for a deleted offer", async () => {
      catalogClientMock.getOffer.mockResolvedValue({ ...offerInfo, deleted: true });

      await expect(service.create(createDto, userId)).rejects.toThrow(
        `Offer with id ${offerId} not found or not active`,
      );
      expect(catalogClientMock.checkAvailability).not.toHaveBeenCalled();
    });

    it("propagates 503 when catalog-service is unavailable", async () => {
      catalogClientMock.getOffer.mockRejectedValue(new ServiceUnavailableException());

      await expect(service.create(createDto, userId)).rejects.toThrow(ServiceUnavailableException);
    });

    it("does not compensate when the reservation is refused (409: the last slot was taken meanwhile)", async () => {
      arrangeHappyPath();
      catalogClientMock.reserve.mockRejectedValue(new ConflictException("No capacity left"));

      await expect(service.create(createDto, userId)).rejects.toThrow(ConflictException);
      expect(catalogClientMock.release).not.toHaveBeenCalled();
      expect(prismaServiceMock.$transaction).not.toHaveBeenCalled();
    });

    it("compensates when the reservation call fails ambiguously (503 / timeout)", async () => {
      arrangeHappyPath();
      catalogClientMock.reserve.mockRejectedValue(new ServiceUnavailableException());
      catalogClientMock.release.mockResolvedValue({ remainingCapacity: 2 });

      await expect(service.create(createDto, userId)).rejects.toThrow(ServiceUnavailableException);
      expect(catalogClientMock.release).toHaveBeenCalledWith(offerId);
      expect(prismaServiceMock.$transaction).not.toHaveBeenCalled();
    });

    it("compensates exactly once and rethrows when the booking transaction fails", async () => {
      arrangeHappyPath();
      const dbError = new Error("booking_db is down");
      prismaServiceMock.$transaction.mockRejectedValue(dbError);
      catalogClientMock.release.mockResolvedValue({ remainingCapacity: 2 });

      await expect(service.create(createDto, userId)).rejects.toBe(dbError);
      expect(catalogClientMock.release).toHaveBeenCalledTimes(1);
      expect(catalogClientMock.release).toHaveBeenCalledWith(offerId);
    });

    it("keeps the original error when the compensation fails too", async () => {
      arrangeHappyPath();
      const dbError = new Error("booking_db is down");
      prismaServiceMock.$transaction.mockRejectedValue(dbError);
      catalogClientMock.release.mockRejectedValue(new ServiceUnavailableException());

      await expect(service.create(createDto, userId)).rejects.toBe(dbError);
    });

    describe("Idempotency-Key", () => {
      const key = faker.string.uuid();
      const hash = createHash("sha256").update(JSON.stringify(createDto)).digest("hex");

      it("answers a replay with 409 + bookingId before touching catalog-service", async () => {
        prismaServiceMock.idempotencyKey.findUnique.mockResolvedValue({
          id: "k",
          requestHash: hash,
          bookingId: "existing-booking",
          expiresAt: new Date(Date.now() + 60_000),
        });

        const error = await service.create(createDto, userId, key).catch((caught) => caught);

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toEqual(
          expect.objectContaining({ errors: { bookingId: "existing-booking" } }),
        );
        expect(catalogClientMock.getOffer).not.toHaveBeenCalled();
        expect(catalogClientMock.reserve).not.toHaveBeenCalled();
      });

      it("stores the key in the booking transaction and answers with native statuses", async () => {
        arrangeHappyPath();
        prismaServiceMock.idempotencyKey.findUnique.mockResolvedValue(null);

        const result = await service.create(createDto, userId, key);

        expect(prismaServiceMock.idempotencyKey.create).toHaveBeenCalledWith({
          data: expect.objectContaining({ key, requestHash: hash, userId }),
        });
        expect(result.status).toBe("pending");
      });

      it("compensates and answers 409 when a concurrent request with the same key wins", async () => {
        arrangeHappyPath();
        prismaServiceMock.idempotencyKey.findUnique
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({
            id: "k",
            requestHash: hash,
            bookingId: "winner",
            expiresAt: new Date(Date.now() + 60_000),
          });
        prismaServiceMock.$transaction.mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
            code: "P2002",
            clientVersion: "7",
          }),
        );
        catalogClientMock.release.mockResolvedValue({ remainingCapacity: 2 });

        await expect(service.create(createDto, userId, key)).rejects.toThrow(ConflictException);
        expect(catalogClientMock.release).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("status changes", () => {
    function arrangeUpdate(current: Record<string, unknown>) {
      // keeps the row state between updates, like the database (status, then capacityReleased)
      let row = bookingRow(current);
      prismaServiceMock.booking.findUnique.mockResolvedValue(row);
      prismaServiceMock.booking.update.mockImplementation(async ({ data }) => {
        row = { ...row, ...data };
        return row;
      });
      prismaServiceMock.outboxEvent.create.mockResolvedValue({});
      catalogClientMock.getOffer.mockResolvedValue(offerInfo);
      catalogClientMock.release.mockResolvedValue({ remainingCapacity: 2 });
    }

    it("v2: writes booking.status_changed in the same transaction", async () => {
      arrangeUpdate({ status: "pending" });

      await service.changeStatus("id", { status: "confirmed" }, userId);

      expect(prismaServiceMock.outboxEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventType: "booking_status_changed",
          payload: expect.objectContaining({
            fromStatus: "pending",
            toStatus: "confirmed",
            offerTitle: "Weekend in Paris",
          }),
        }),
      });
      expect(catalogClientMock.release).not.toHaveBeenCalled();
    });

    it("v2: releases the slot once when the booking is cancelled", async () => {
      arrangeUpdate({ status: "confirmed" });

      const result = await service.changeStatus("id", { status: "cancelled" }, userId);

      expect(catalogClientMock.release).toHaveBeenCalledWith(offerId);
      expect(prismaServiceMock.booking.update).toHaveBeenLastCalledWith({
        where: { id: expect.any(String) },
        data: { capacityReleased: true },
      });
      expect(result.status).toBe("cancelled");
    });

    it("v2: completed -> cancelled does not release the slot a second time", async () => {
      arrangeUpdate({ status: "completed", capacityReleased: true });

      await service.changeStatus("id", { status: "cancelled" }, userId);

      expect(catalogClientMock.release).not.toHaveBeenCalled();
    });

    it("v2: an illegal transition is 409 (State pattern)", async () => {
      arrangeUpdate({ status: "cancelled" });

      await expect(service.changeStatus("id", { status: "confirmed" }, userId)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaServiceMock.$transaction).not.toHaveBeenCalled();
    });

    it("cancels even if catalog-service is down: the event has no title, the slot stays to be released", async () => {
      arrangeUpdate({ status: "pending" });
      catalogClientMock.getOffer.mockRejectedValue(new ServiceUnavailableException());
      catalogClientMock.release.mockRejectedValue(new ServiceUnavailableException());

      const result = await service.changeStatus("id", { status: "cancelled" }, userId);

      expect(result.status).toBe("cancelled");
      expect(prismaServiceMock.outboxEvent.create.mock.calls[0][0].data.payload.offerTitle).toBe(
        undefined,
      );
      expect(prismaServiceMock.booking.update).not.toHaveBeenCalledWith(
        expect.objectContaining({ data: { capacityReleased: true } }),
      );
    });

    it("refuses to confirm when the offer is no longer active", async () => {
      arrangeUpdate({ status: "pending" });
      catalogClientMock.getOffer.mockResolvedValue({ ...offerInfo, status: "archived" });

      await expect(service.changeStatus("id", { status: "confirmed" }, userId)).rejects.toThrow(
        "Offer is no longer active",
      );
    });

    it("needs catalog-service to confirm (503 when it is down)", async () => {
      arrangeUpdate({ status: "pending" });
      catalogClientMock.getOffer.mockRejectedValue(new ServiceUnavailableException());

      await expect(service.changeStatus("id", { status: "confirmed" }, userId)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it("v1: an illegal transition is 400 and the response uses v1 statuses", async () => {
      arrangeUpdate({ status: "cancelled" });

      await expect(service.updateStatus("id", { status: "confirmed" }, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("v1: also writes booking.status_changed", async () => {
      arrangeUpdate({ status: "pending" });

      await service.updateStatus("id", { status: "cancelled" }, userId);

      expect(prismaServiceMock.outboxEvent.create).toHaveBeenCalledTimes(1);
      expect(catalogClientMock.release).toHaveBeenCalledTimes(1);
    });

    it("forbids changing another user's booking (unless Admin)", async () => {
      arrangeUpdate({ userId: "someone", status: "pending" });

      await expect(service.changeStatus("id", { status: "cancelled" }, userId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(
        service.changeStatus("id", { status: "cancelled" }, userId, UserRole.Admin),
      ).resolves.toBeDefined();
    });
  });
});
