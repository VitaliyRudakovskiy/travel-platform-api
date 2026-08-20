import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { OffersService } from "./offers.service";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { offerMock } from "@tests/mocks/offer.mock";
import { destinationMock } from "@tests/mocks/destination.mock";

describe("OffersService", () => {
  let service: OffersService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OffersService, providePrisma()],
    }).compile();

    service = module.get<OffersService>(OffersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    const baseQuery = {
      page: 1,
      limit: 10,
      status: "active",
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    it("returns a paginated list with default status filter", async () => {
      prismaServiceMock.offer.findMany.mockResolvedValue([offerMock]);
      prismaServiceMock.offer.count.mockResolvedValue(1);

      const result = await service.getAll(baseQuery);

      expect(prismaServiceMock.offer.findMany).toHaveBeenCalledWith({
        where: { status: "active" },
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          destination: {
            select: { id: true, name: true, countryCode: true },
          },
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      });
      expect(prismaServiceMock.offer.count).toHaveBeenCalledWith({
        where: { status: "active" },
      });
      expect(result).toEqual({
        data: [{ ...offerMock, price: offerMock.price.toNumber() }],
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

    it("applies type, destination, price and date filters", async () => {
      const availableFrom = "2026-01-01T00:00:00.000Z";
      const availableTo = "2026-12-31T00:00:00.000Z";
      const query = {
        ...baseQuery,
        type: "hotel",
        destinationId: faker.string.uuid(),
        minPrice: 100,
        maxPrice: 500,
        availableFrom,
        availableTo,
        sortBy: "price",
        sortOrder: "asc",
      };
      prismaServiceMock.offer.findMany.mockResolvedValue([]);
      prismaServiceMock.offer.count.mockResolvedValue(0);

      await service.getAll(query);

      expect(prismaServiceMock.offer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: "active",
            type: "hotel",
            destinationId: query.destinationId,
            price: { gte: 100, lte: 500 },
            AND: [
              { availableFrom: { lte: new Date(availableTo) } },
              { availableTo: { gte: new Date(availableFrom) } },
            ],
          },
          skip: 0,
          take: 10,
          orderBy: { price: "asc" },
        }),
      );
    });
  });

  describe("getById", () => {
    it("returns the offer when found", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(offerMock);

      const result = await service.getById(offerMock.id);

      expect(prismaServiceMock.offer.findFirst).toHaveBeenCalledWith({
        where: { id: offerMock.id, deletedAt: null },
        include: {
          destination: {
            select: { id: true, name: true, countryCode: true },
          },
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      });
      expect(result).toEqual({
        ...offerMock,
        price: offerMock.price.toNumber(),
      });
    });

    it("throws NotFoundException when offer is not found", async () => {
      prismaServiceMock.offer.findFirst.mockResolvedValue(null);

      await expect(service.getById(offerMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    const ownerId = faker.string.uuid();
    const createOfferDto = {
      type: "hotel",
      destinationId: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      price: 150.5,
      currency: "USD",
      maxGuests: 2,
      maxConcurrentBookings: 1,
      availableFrom: "2026-01-01T00:00:00.000Z",
      availableTo: "2026-12-31T00:00:00.000Z",
      stars: 5,
      address: faker.location.streetAddress(),
    };

    it("creates a hotel offer", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue(destinationMock);
      prismaServiceMock.offer.create.mockResolvedValue(offerMock);

      const result = await service.create(createOfferDto, ownerId);

      expect(prismaServiceMock.destination.findUnique).toHaveBeenCalledWith({
        where: { id: createOfferDto.destinationId },
      });
      expect(prismaServiceMock.offer.create).toHaveBeenCalledWith({
        data: {
          type: "hotel",
          destinationId: createOfferDto.destinationId,
          ownerId,
          title: createOfferDto.title,
          price: createOfferDto.price,
          currency: createOfferDto.currency,
          maxGuests: createOfferDto.maxGuests,
          maxConcurrentBookings: createOfferDto.maxConcurrentBookings,
          availableFrom: new Date(createOfferDto.availableFrom),
          availableTo: new Date(createOfferDto.availableTo),
          status: "active",
          description: createOfferDto.description,
          stars: createOfferDto.stars,
          address: createOfferDto.address,
          airline: null,
          flightNumber: null,
          durationDays: null,
          includesMeals: null,
        },
        include: {
          destination: true,
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      });
      expect(result).toEqual({
        ...offerMock,
        price: offerMock.price.toNumber(),
      });
    });

    it("throws NotFoundException when destination does not exist", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue(null);

      await expect(service.create(createOfferDto, ownerId)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.offer.create).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when end date is not after start date", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue(destinationMock);

      await expect(
        service.create(
          {
            ...createOfferDto,
            availableFrom: "2026-12-31T00:00:00.000Z",
            availableTo: "2026-01-01T00:00:00.000Z",
          },
          ownerId,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.offer.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    const existingOffer = { ...offerMock };
    const ownerId = offerMock.ownerId;
    const updateOfferDto = { title: faker.lorem.words(3) };

    it("updates the offer when owned by the user", async () => {
      const updatedOffer = { ...offerMock, title: updateOfferDto.title };
      prismaServiceMock.offer.findUnique.mockResolvedValue(existingOffer);
      prismaServiceMock.offer.update.mockResolvedValue(updatedOffer);

      const result = await service.update(offerMock.id, updateOfferDto, ownerId);

      expect(prismaServiceMock.offer.findUnique).toHaveBeenCalledWith({
        where: { id: offerMock.id, deletedAt: null },
      });
      expect(prismaServiceMock.offer.update).toHaveBeenCalledWith({
        where: { id: offerMock.id },
        data: {
          destinationId: existingOffer.destinationId,
          title: updateOfferDto.title,
          description: existingOffer.description,
          price: existingOffer.price,
          currency: existingOffer.currency,
          maxGuests: existingOffer.maxGuests,
          maxConcurrentBookings: existingOffer.maxConcurrentBookings,
          availableFrom: existingOffer.availableFrom,
          availableTo: existingOffer.availableTo,
          status: existingOffer.status,
          stars: existingOffer.stars,
          address: existingOffer.address,
          flightNumber: null,
          airline: null,
          durationDays: null,
          includesMeals: null,
        },
        include: {
          destination: {
            select: { id: true, name: true, countryCode: true },
          },
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      });
      expect(result).toEqual({
        ...updatedOffer,
        price: updatedOffer.price.toNumber(),
      });
    });

    it("throws NotFoundException when offer is not found", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(null);

      await expect(service.update(offerMock.id, updateOfferDto, ownerId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaServiceMock.offer.update).not.toHaveBeenCalled();
    });

    it("throws ForbiddenException when user is not the owner", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(existingOffer);

      await expect(
        service.update(offerMock.id, updateOfferDto, faker.string.uuid()),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaServiceMock.offer.update).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when trying to change offer type", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(existingOffer);

      await expect(service.update(offerMock.id, { type: "flight" }, ownerId)).rejects.toThrow(
        BadRequestException,
      );

      expect(prismaServiceMock.offer.update).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when end date is not after start date", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(existingOffer);

      await expect(
        service.update(offerMock.id, { availableTo: "2020-01-01T00:00:00.000Z" }, ownerId),
      ).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.offer.update).not.toHaveBeenCalled();
    });

    it("throws NotFoundException when destination does not exist", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(existingOffer);
      prismaServiceMock.destination.findUnique.mockResolvedValue(null);

      await expect(
        service.update(offerMock.id, { destinationId: faker.string.uuid() }, ownerId),
      ).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.offer.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    const ownerId = offerMock.ownerId;

    it("soft deletes the offer when owned by the user", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(offerMock);
      prismaServiceMock.offer.update.mockResolvedValue(offerMock);

      await service.delete(offerMock.id, ownerId);

      expect(prismaServiceMock.offer.findUnique).toHaveBeenCalledWith({
        where: { id: offerMock.id, deletedAt: null },
      });
      expect(prismaServiceMock.offer.update).toHaveBeenCalledWith({
        where: { id: offerMock.id },
        data: {
          deletedAt: expect.any(Date),
          status: "archived",
        },
      });
    });

    it("throws NotFoundException when offer is not found", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(null);

      await expect(service.delete(offerMock.id, ownerId)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.offer.update).not.toHaveBeenCalled();
    });

    it("throws ConflictException when user is not the owner", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(offerMock);

      await expect(service.delete(offerMock.id, faker.string.uuid())).rejects.toThrow(
        ConflictException,
      );

      expect(prismaServiceMock.offer.update).not.toHaveBeenCalled();
    });
  });

  describe("hardDelete", () => {
    const ownerId = offerMock.ownerId;

    it("permanently deletes the offer when owned by the user", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(offerMock);
      prismaServiceMock.offer.delete.mockResolvedValue(offerMock);

      await service.hardDelete(offerMock.id, ownerId);

      expect(prismaServiceMock.offer.findUnique).toHaveBeenCalledWith({
        where: { id: offerMock.id },
      });
      expect(prismaServiceMock.offer.delete).toHaveBeenCalledWith({
        where: { id: offerMock.id },
      });
    });

    it("throws NotFoundException when offer is not found", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(null);

      await expect(service.hardDelete(offerMock.id, ownerId)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.offer.delete).not.toHaveBeenCalled();
    });

    it("throws ConflictException when user is not the owner", async () => {
      prismaServiceMock.offer.findUnique.mockResolvedValue(offerMock);

      await expect(service.hardDelete(offerMock.id, faker.string.uuid())).rejects.toThrow(
        ConflictException,
      );

      expect(prismaServiceMock.offer.delete).not.toHaveBeenCalled();
    });
  });
});
