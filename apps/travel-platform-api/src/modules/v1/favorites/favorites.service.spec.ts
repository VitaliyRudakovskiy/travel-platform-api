import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { FavoritesService } from "./favorites.service";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { favoriteMock } from "@tests/mocks/favorite.mock";
import { offerMock } from "@tests/mocks/offer.mock";
import { userMock } from "@tests/mocks/user.mock";

describe("FavoritesService", () => {
  let service: FavoritesService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesService, providePrisma()],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    const userId = faker.string.uuid();
    const query = { page: 1, limit: 10 };

    it("returns a paginated list of favorites for the user", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.favorite.count.mockResolvedValue(1);
      prismaServiceMock.favorite.findMany.mockResolvedValue([favoriteMock]);

      const result = await service.getAll(userId, query);

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });

      expect(prismaServiceMock.favorite.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          offer: {
            include: {
              destination: true,
              user: {
                select: { id: true, email: true, username: true },
              },
            },
          },
        },
      });

      expect(result).toEqual({
        data: [
          {
            ...favoriteMock,
            offer: {
              ...favoriteMock.offer,
              price: favoriteMock.offer.price.toNumber(),
              description: { ...favoriteMock.offer.destination },
              owner: { ...favoriteMock.offer.user },
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

    it("throws NotFoundException when user is not found", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getAll(userId, query)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.favorite.findMany).not.toHaveBeenCalled();
    });
  });

  describe("addToFavorites", () => {
    const userId = faker.string.uuid();

    it("adds an offer to favorites", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(offerMock);
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.favorite.create.mockResolvedValue(favoriteMock);

      const result = await service.addToFavorites(favoriteMock.offerId, userId);

      expect(prismaServiceMock.offer.findFirst).toHaveBeenCalledWith({
        where: { id: favoriteMock.offerId, deletedAt: null },
      });
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaServiceMock.favorite.create).toHaveBeenCalledWith({
        data: {
          userId,
          offerId: favoriteMock.offerId,
        },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });

      const { offer, ...rest } = favoriteMock;
      expect(result).toEqual({
        ...rest,
        offer: {
          ...offer,
          price: offer.price.toNumber(),
        },
      });
    });

    it("throws NotFoundException when offer is not found", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(null);

      await expect(service.addToFavorites(favoriteMock.offerId, userId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaServiceMock.favorite.create).not.toHaveBeenCalled();
    });

    it("throws NotFoundException when user is not found", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(offerMock);
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.addToFavorites(favoriteMock.offerId, userId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaServiceMock.favorite.create).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the offer is already in favorites", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(offerMock);
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.favorite.create.mockRejectedValue({ code: "P2002" });

      await expect(service.addToFavorites(favoriteMock.offerId, userId)).rejects.toThrow(
        ConflictException,
      );
    });

    it("rethrows unknown errors", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(offerMock);
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      const error = new Error("database down");
      prismaServiceMock.favorite.create.mockRejectedValue(error);

      await expect(service.addToFavorites(favoriteMock.offerId, userId)).rejects.toThrow(
        "database down",
      );
    });
  });

  describe("removeFromFavorites", () => {
    const userId = faker.string.uuid();

    it("removes an offer from favorites", async () => {
      prismaServiceMock.favorite.findUnique.mockResolvedValue(favoriteMock);
      prismaServiceMock.favorite.delete.mockResolvedValue(favoriteMock);

      await service.removeFromFavorites(favoriteMock.offerId, userId);

      expect(prismaServiceMock.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          userId_offerId: {
            userId,
            offerId: favoriteMock.offerId,
          },
        },
      });
      expect(prismaServiceMock.favorite.delete).toHaveBeenCalledWith({
        where: { id: favoriteMock.id },
      });
    });

    it("throws NotFoundException when the offer is not in favorites", async () => {
      prismaServiceMock.favorite.findUnique.mockResolvedValue(null);

      await expect(service.removeFromFavorites(favoriteMock.offerId, userId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaServiceMock.favorite.delete).not.toHaveBeenCalled();
    });
  });

  describe("isFavorite", () => {
    const userId = faker.string.uuid();

    it("returns true when the offer is in favorites", async () => {
      prismaServiceMock.favorite.findUnique.mockResolvedValue(favoriteMock);

      const result = await service.isFavorite(favoriteMock.offerId, userId);

      expect(result).toBe(true);
    });

    it("returns false when the offer is not in favorites", async () => {
      prismaServiceMock.favorite.findUnique.mockResolvedValue(null);

      const result = await service.isFavorite(favoriteMock.offerId, userId);

      expect(result).toBe(false);
    });
  });
});
