import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { Prisma } from "#booking-prisma";
import { providePrisma } from "../../../tests/providers/provide-prisma";
import { provideCatalogClient } from "../../../tests/providers/provide-catalog-client";
import { prismaServiceMock } from "../../../tests/mocks/prisma-service.mock";
import { catalogClientMock } from "../../../tests/mocks/catalog-client.mock";
import { FavoritesService } from "./favorites.service";

const userId = faker.string.uuid();
const offerId = faker.string.uuid();

const offerInfo = {
  id: offerId,
  ownerId: faker.string.uuid(),
  title: "Hotel",
  type: "hotel",
  price: "120.50",
  currency: "BYN",
  destinationId: faker.string.uuid(),
  destinationName: "Minsk",
  destinationCountryCode: "BY",
  status: "active",
  deleted: false,
};

const favorite = { id: faker.string.uuid(), userId, offerId, createdAt: new Date() };

const expectedSummary = {
  id: offerId,
  title: "Hotel",
  type: "hotel",
  price: 120.5,
  currency: "BYN",
  destination: { id: offerInfo.destinationId, name: "Minsk", countryCode: "BY" },
};

describe("FavoritesService", () => {
  let service: FavoritesService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesService, providePrisma(), provideCatalogClient()],
    }).compile();

    service = module.get(FavoritesService);
  });

  describe("getAll", () => {
    it("returns the user's favorites with the offer summary from catalog-service", async () => {
      prismaServiceMock.favorite.count.mockResolvedValue(1);
      prismaServiceMock.favorite.findMany.mockResolvedValue([favorite]);
      catalogClientMock.getOffersByIds.mockResolvedValue(new Map([[offerId, offerInfo]]));

      const result = await service.getAll(userId, { page: 1, limit: 10 } as never);

      expect(prismaServiceMock.favorite.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
      expect(result.data).toEqual([{ ...favorite, offer: expectedSummary }]);
      expect(result.meta).toEqual(expect.objectContaining({ total: 1, totalPages: 1 }));
    });

    it("returns favorites without `offer` when catalog-service is unavailable", async () => {
      prismaServiceMock.favorite.count.mockResolvedValue(1);
      prismaServiceMock.favorite.findMany.mockResolvedValue([favorite]);
      catalogClientMock.getOffersByIds.mockRejectedValue(new ServiceUnavailableException());

      const result = await service.getAll(userId, { page: 1, limit: 10 } as never);

      expect(result.data).toEqual([favorite]);
    });
  });

  describe("addToFavorites", () => {
    it("checks the offer in catalog-service and stores the favorite", async () => {
      catalogClientMock.getOffer.mockResolvedValue(offerInfo);
      prismaServiceMock.favorite.create.mockResolvedValue(favorite);

      const result = await service.addToFavorites(offerId, userId);

      expect(prismaServiceMock.favorite.create).toHaveBeenCalledWith({ data: { userId, offerId } });
      expect(result).toEqual({ ...favorite, offer: expectedSummary });
    });

    it.each([
      ["unknown", () => catalogClientMock.getOffer.mockRejectedValue(new NotFoundException())],
      [
        "deleted",
        () => catalogClientMock.getOffer.mockResolvedValue({ ...offerInfo, deleted: true }),
      ],
    ])("throws NotFoundException for a %s offer", async (_case, arrange) => {
      arrange();

      await expect(service.addToFavorites(offerId, userId)).rejects.toThrow(
        `Offer with id ${offerId} not found`,
      );
      expect(prismaServiceMock.favorite.create).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the offer is already in favorites", async () => {
      catalogClientMock.getOffer.mockResolvedValue(offerInfo);
      prismaServiceMock.favorite.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
          code: "P2002",
          clientVersion: "7",
        }),
      );

      await expect(service.addToFavorites(offerId, userId)).rejects.toThrow(ConflictException);
    });

    it("propagates 503 when catalog-service is unavailable", async () => {
      catalogClientMock.getOffer.mockRejectedValue(new ServiceUnavailableException());

      await expect(service.addToFavorites(offerId, userId)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });

  describe("removeFromFavorites", () => {
    it("deletes the favorite", async () => {
      prismaServiceMock.favorite.findUnique.mockResolvedValue(favorite);

      await service.removeFromFavorites(offerId, userId);

      expect(prismaServiceMock.favorite.delete).toHaveBeenCalledWith({
        where: { id: favorite.id },
      });
    });

    it("throws NotFoundException when the offer is not in favorites", async () => {
      prismaServiceMock.favorite.findUnique.mockResolvedValue(null);

      await expect(service.removeFromFavorites(offerId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("isFavorite", () => {
    it.each([
      [favorite, true],
      [null, false],
    ])("returns whether the favorite exists", async (row, expected) => {
      prismaServiceMock.favorite.findUnique.mockResolvedValue(row);

      await expect(service.isFavorite(offerId, userId)).resolves.toBe(expected);
    });
  });
});
