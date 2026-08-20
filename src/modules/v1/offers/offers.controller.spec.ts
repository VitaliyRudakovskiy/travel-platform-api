import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { OffersController } from "./offers.controller";
import { provideOffersService } from "@tests/providers/provide-offers-service";
import { offersServiceMock } from "@tests/mocks/offers-service.mock";
import { offerMock } from "@tests/mocks/offer.mock";
import { providePrisma } from "@tests/providers/provide-prisma";
import { OfferStatus } from "@prisma/client";

describe("OffersController", () => {
  let controller: OffersController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [provideOffersService(), providePrisma()],
    }).compile();

    controller = module.get<OffersController>(OffersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAll", () => {
    it("calls offersService.getAll and returns its result", async () => {
      const query = {
        page: 1,
        limit: 10,
        status: OfferStatus.active,
        sortBy: "price" as const,
        sortOrder: "desc" as const,
      };

      const result = {
        data: [{ ...offerMock, price: offerMock.price.toNumber() }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      offersServiceMock.getAll.mockResolvedValue(result);

      const response = await controller.getAll(query);

      expect(offersServiceMock.getAll).toHaveBeenCalledWith(query);
      expect(response).toEqual(result);
    });
  });

  describe("getOne", () => {
    it("calls offersService.getById and returns its result", async () => {
      offersServiceMock.getById.mockResolvedValue({
        ...offerMock,
        price: offerMock.price.toNumber(),
      });

      const result = await controller.getOne(offerMock.id);

      expect(offersServiceMock.getById).toHaveBeenCalledWith(offerMock.id);
      expect(result).toEqual({
        ...offerMock,
        price: offerMock.price.toNumber(),
      });
    });
  });

  describe("create", () => {
    it("calls offersService.create with the current user id", async () => {
      const createOfferDto = {
        type: "hotel",
        destinationId: faker.string.uuid(),
        title: faker.lorem.words(3),
        price: 150.5,
        currency: "USD",
        maxGuests: 2,
        maxConcurrentBookings: 1,
        availableFrom: "2026-01-01T00:00:00.000Z",
        availableTo: "2026-12-31T00:00:00.000Z",
        status: "active",
        stars: 5,
        address: faker.location.streetAddress(),
      } as const;

      offersServiceMock.create.mockResolvedValue({
        ...offerMock,
        price: offerMock.price.toNumber(),
      });

      const result = await controller.create(createOfferDto, {
        id: offerMock.ownerId,
      } as never);

      expect(offersServiceMock.create).toHaveBeenCalledWith(createOfferDto, offerMock.ownerId);

      expect(result).toEqual({
        ...offerMock,
        price: offerMock.price.toNumber(),
      });
    });
  });

  describe("update", () => {
    it("calls offersService.update with the current user id", async () => {
      const updateOfferDto = { title: faker.lorem.words(3) };
      offersServiceMock.update.mockResolvedValue({
        ...offerMock,
        title: updateOfferDto.title,
        price: offerMock.price.toNumber(),
      });

      const result = await controller.update(offerMock.id, updateOfferDto, {
        id: offerMock.ownerId,
      } as never);

      expect(offersServiceMock.update).toHaveBeenCalledWith(
        offerMock.id,
        updateOfferDto,
        offerMock.ownerId,
      );
      expect(result).toEqual({
        ...offerMock,
        title: updateOfferDto.title,
        price: offerMock.price.toNumber(),
      });
    });
  });

  describe("delete", () => {
    it("calls offersService.delete with the current user id", async () => {
      offersServiceMock.delete.mockResolvedValue(undefined);

      await controller.delete(offerMock.id, { id: offerMock.ownerId } as never);

      expect(offersServiceMock.delete).toHaveBeenCalledWith(offerMock.id, offerMock.ownerId);
    });
  });

  describe("hardDelete", () => {
    it("calls offersService.hardDelete with the current user id", async () => {
      offersServiceMock.hardDelete.mockResolvedValue(undefined);

      await controller.hardDelete(offerMock.id, {
        id: offerMock.ownerId,
      } as never);

      expect(offersServiceMock.hardDelete).toHaveBeenCalledWith(offerMock.id, offerMock.ownerId);
    });
  });
});
