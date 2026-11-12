import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { OfferStatus } from "../../v1/offers/models/offer.enums";
import { UserRole } from "@app/common";
import { OffersController } from "./offers.controller";
import { provideOffersService } from "../../../tests/providers/provide-offers-service";
import { offersServiceMock } from "../../../tests/mocks/offers-service.mock";
import { offerMock } from "../../../tests/mocks/offer.mock";

describe("OffersController v2", () => {
  let controller: OffersController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [provideOffersService()],
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
        data: [{ ...offerMock, price: offerMock.price }],
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
        price: offerMock.price,
      });

      const result = await controller.create(createOfferDto, {
        id: offerMock.ownerId,
        role: UserRole.Agent,
      } as never);

      expect(offersServiceMock.create).toHaveBeenCalledWith(createOfferDto, offerMock.ownerId);
      expect(result).toEqual({
        ...offerMock,
        price: offerMock.price,
      });
    });
  });

  describe("update", () => {
    it("calls offersService.update with the current user id and role", async () => {
      const updateOfferDto = { title: faker.lorem.words(3) };
      offersServiceMock.update.mockResolvedValue({
        ...offerMock,
        title: updateOfferDto.title,
        price: offerMock.price,
      });

      const result = await controller.update(offerMock.id, updateOfferDto, {
        id: offerMock.ownerId,
        role: UserRole.Admin,
      } as never);

      expect(offersServiceMock.update).toHaveBeenCalledWith(
        offerMock.id,
        updateOfferDto,
        offerMock.ownerId,
        UserRole.Admin,
      );
      expect(result).toEqual({
        ...offerMock,
        title: updateOfferDto.title,
        price: offerMock.price,
      });
    });
  });

  describe("delete", () => {
    it("calls offersService.delete with the current user id and role", async () => {
      offersServiceMock.delete.mockResolvedValue(undefined);

      await controller.delete(offerMock.id, {
        id: offerMock.ownerId,
        role: UserRole.Agent,
      } as never);

      expect(offersServiceMock.delete).toHaveBeenCalledWith(
        offerMock.id,
        offerMock.ownerId,
        UserRole.Agent,
      );
    });
  });
});
