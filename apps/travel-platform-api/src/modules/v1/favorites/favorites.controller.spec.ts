import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { FavoritesController } from "./favorites.controller";
import { provideFavoritesService } from "@tests/providers/provide-favorites-service";
import { favoritesServiceMock } from "@tests/mocks/favorites-service.mock";
import { favoriteMock } from "@tests/mocks/favorite.mock";
import { providePrisma } from "@tests/providers/provide-prisma";

describe("FavoritesController", () => {
  let controller: FavoritesController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [provideFavoritesService(), providePrisma()],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getFavorites", () => {
    it("calls favoritesService.getAll with the current user id", async () => {
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
      favoritesServiceMock.getAll.mockResolvedValue(result);

      const response = await controller.getFavorites(query, {
        id: favoriteMock.userId,
      } as never);

      expect(favoritesServiceMock.getAll).toHaveBeenCalledWith(favoriteMock.userId, query);
      expect(response).toEqual(result);
    });
  });

  describe("isFavorite", () => {
    it("returns the favoritesService.isFavorite result wrapped in an object", async () => {
      favoritesServiceMock.isFavorite.mockResolvedValue(true);

      const result = await controller.isFavorite(favoriteMock.offerId, {
        id: favoriteMock.userId,
      } as never);

      expect(favoritesServiceMock.isFavorite).toHaveBeenCalledWith(
        favoriteMock.offerId,
        favoriteMock.userId,
      );
      expect(result).toEqual({ isFavorite: true });
    });
  });

  describe("addToFavorites", () => {
    it("calls favoritesService.addToFavorites with the offer id and current user id", async () => {
      favoritesServiceMock.addToFavorites.mockResolvedValue(favoriteMock);

      const result = await controller.addToFavorites(favoriteMock.offerId, {
        id: favoriteMock.userId,
      } as never);

      expect(favoritesServiceMock.addToFavorites).toHaveBeenCalledWith(
        favoriteMock.offerId,
        favoriteMock.userId,
      );
      expect(result).toEqual(favoriteMock);
    });
  });

  describe("deleteFromFavorites", () => {
    it("calls favoritesService.removeFromFavorites with the current user id", async () => {
      favoritesServiceMock.removeFromFavorites.mockResolvedValue(undefined);

      await controller.deleteFromFavorites(favoriteMock.offerId, {
        id: favoriteMock.userId,
      } as never);

      expect(favoritesServiceMock.removeFromFavorites).toHaveBeenCalledWith(
        favoriteMock.offerId,
        favoriteMock.userId,
      );
    });
  });
});
