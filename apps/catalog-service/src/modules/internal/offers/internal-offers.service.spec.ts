import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UnavailabilityReason } from "@app/contracts";
import { OfferEntity } from "../../v1/offers/entities/offer.entity";
import { OfferStatus } from "../../v1/offers/models/offer.enums";
import { createRepositoryMock } from "../../../tests/mocks/repository.mock";
import { offerMock } from "../../../tests/mocks/offer.mock";
import { InternalOffersService } from "./internal-offers.service";

// offerMock: available 2026-01-01..2027-12-31, maxConcurrentBookings 3, reservedCapacity 1
const validQuery = {
  startDate: "2026-06-01T00:00:00.000Z",
  endDate: "2026-06-05T00:00:00.000Z",
  guestsCount: 1,
};

function mockUpdateQueryBuilder(execute: ReturnType<typeof vi.fn>) {
  const builder = {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    setParameters: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    execute,
  };
  return builder;
}

describe("InternalOffersService", () => {
  let service: InternalOffersService;
  const offersRepository = createRepositoryMock();

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternalOffersService,
        { provide: getRepositoryToken(OfferEntity), useValue: offersRepository },
      ],
    }).compile();

    service = module.get(InternalOffersService);
  });

  describe("checkAvailability", () => {
    it("is available with the remaining capacity", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);

      await expect(service.checkAvailability(offerMock.id, validQuery)).resolves.toEqual({
        available: true,
        remainingCapacity: 2,
      });
    });

    it("throws NotFoundException for an unknown (or soft-deleted) offer", async () => {
      offersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.checkAvailability(offerMock.id, validQuery)).rejects.toThrow(
        NotFoundException,
      );
    });

    it.each([
      [
        "an archived offer",
        { ...offerMock, status: OfferStatus.archived },
        validQuery,
        UnavailabilityReason.OFFER_NOT_ACTIVE,
      ],
      [
        "end date before start date",
        offerMock,
        { ...validQuery, endDate: validQuery.startDate },
        UnavailabilityReason.INVALID_DATES,
      ],
      [
        "dates outside the availability window",
        offerMock,
        { ...validQuery, endDate: "2028-01-05T00:00:00.000Z" },
        UnavailabilityReason.DATES_OUT_OF_RANGE,
      ],
      [
        "too many guests",
        offerMock,
        { ...validQuery, guestsCount: offerMock.maxGuests + 1 },
        UnavailabilityReason.GUESTS_EXCEEDED,
      ],
      [
        "no capacity left",
        { ...offerMock, reservedCapacity: offerMock.maxConcurrentBookings },
        validQuery,
        UnavailabilityReason.NO_CAPACITY,
      ],
    ])("is not available for %s", async (_case, offer, query, reason) => {
      offersRepository.findOneBy.mockResolvedValue(offer);

      const result = await service.checkAvailability(offerMock.id, query);

      expect(result).toEqual(
        expect.objectContaining({ available: false, reason, message: expect.any(String) }),
      );
    });
  });

  describe("changeCapacity", () => {
    it("reserves a slot with one atomic conditional UPDATE", async () => {
      const execute = vi.fn().mockResolvedValue({
        affected: 1,
        raw: [{ max_concurrent_bookings: 3, reserved_capacity: 2 }],
      });
      const builder = mockUpdateQueryBuilder(execute);
      offersRepository.createQueryBuilder.mockReturnValue(builder);

      await expect(service.changeCapacity(offerMock.id, 1)).resolves.toEqual({
        remainingCapacity: 1,
      });
      expect(builder.andWhere).toHaveBeenCalledWith(
        "reserved_capacity + :delta BETWEEN 0 AND max_concurrent_bookings",
      );
      expect(builder.setParameters).toHaveBeenCalledWith({ id: offerMock.id, delta: 1 });
      // property names, not column names: with column names RETURNING comes back empty (found live)
      expect(builder.returning).toHaveBeenCalledWith(["maxConcurrentBookings", "reservedCapacity"]);
    });

    it("throws ConflictException when no capacity is left (+1)", async () => {
      offersRepository.createQueryBuilder.mockReturnValue(
        mockUpdateQueryBuilder(vi.fn().mockResolvedValue({ affected: 0, raw: [] })),
      );
      offersRepository.existsBy.mockResolvedValue(true);

      await expect(service.changeCapacity(offerMock.id, 1)).rejects.toThrow(
        "No capacity left for this offer",
      );
    });

    it("throws ConflictException when nothing is reserved (-1)", async () => {
      offersRepository.createQueryBuilder.mockReturnValue(
        mockUpdateQueryBuilder(vi.fn().mockResolvedValue({ affected: 0, raw: [] })),
      );
      offersRepository.existsBy.mockResolvedValue(true);

      await expect(service.changeCapacity(offerMock.id, -1)).rejects.toThrow(ConflictException);
    });

    it("throws NotFoundException when the offer does not exist", async () => {
      offersRepository.createQueryBuilder.mockReturnValue(
        mockUpdateQueryBuilder(vi.fn().mockResolvedValue({ affected: 0, raw: [] })),
      );
      offersRepository.existsBy.mockResolvedValue(false);

      await expect(service.changeCapacity(offerMock.id, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("read API for gRPC", () => {
    it("maps an offer to OfferInfo with the price as a decimal string", async () => {
      offersRepository.findOne.mockResolvedValue({
        ...offerMock,
        destination: { name: "Paris" },
      });

      const result = await service.getOffer(offerMock.id);

      expect(result).toEqual(
        expect.objectContaining({
          id: offerMock.id,
          ownerId: offerMock.ownerId,
          price: "150.50",
          destinationName: "Paris",
          availableFrom: "2026-01-01T00:00:00.000Z",
          deleted: false,
        }),
      );
    });

    it("returns null for an unknown offer", async () => {
      offersRepository.findOne.mockResolvedValue(null);

      await expect(service.getOffer(offerMock.id)).resolves.toBeNull();
    });

    it("returns an empty list without querying the DB when no ids are given", async () => {
      await expect(service.getOffersByIds([])).resolves.toEqual([]);
      expect(offersRepository.find).not.toHaveBeenCalled();
    });

    it("lists offer ids of an owner, deleted offers included", async () => {
      offersRepository.find.mockResolvedValue([{ id: "a" }, { id: "b" }]);

      await expect(service.listOfferIdsByOwner(offerMock.ownerId)).resolves.toEqual(["a", "b"]);
      expect(offersRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { ownerId: offerMock.ownerId }, withDeleted: true }),
      );
    });
  });
});
