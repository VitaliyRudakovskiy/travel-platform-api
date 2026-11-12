import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UserRole } from "@app/common";
import { DestinationEntity } from "../destinations/entities/destination.entity";
import { OfferEntity } from "./entities/offer.entity";
import { OffersService } from "./offers.service";
import { Currency, OfferStatus, OfferType } from "./models/offer.enums";
import { createRepositoryMock } from "../../../tests/mocks/repository.mock";
import { offerMock } from "../../../tests/mocks/offer.mock";
import { destinationMock } from "../../../tests/mocks/destination.mock";

describe("OffersService", () => {
  let service: OffersService;
  const offersRepository = createRepositoryMock();
  const destinationsRepository = createRepositoryMock();

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        { provide: getRepositoryToken(OfferEntity), useValue: offersRepository },
        { provide: getRepositoryToken(DestinationEntity), useValue: destinationsRepository },
      ],
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
    } as const;

    it("returns a paginated list with default status filter, without reservedCapacity", async () => {
      offersRepository.findAndCount.mockResolvedValue([[offerMock], 1]);

      const result = await service.getAll(baseQuery);

      expect(offersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "active" },
          skip: 0,
          take: 10,
          order: { createdAt: "desc" },
          relations: { destination: true },
        }),
      );
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      expect(result.data[0]).not.toHaveProperty("reservedCapacity");
      expect(result.data[0].price).toBe(150.5);
    });

    it("applies type, destination, price and date filters", async () => {
      offersRepository.findAndCount.mockResolvedValue([[], 0]);
      const destinationId = faker.string.uuid();

      await service.getAll({
        ...baseQuery,
        page: 2,
        type: "hotel",
        destinationId,
        minPrice: 100,
        maxPrice: 500,
        availableFrom: "2026-06-01T00:00:00.000Z",
        availableTo: "2026-06-10T00:00:00.000Z",
      });

      expect(offersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: "active",
            type: "hotel",
            destinationId,
            price: Between(100, 500),
            // overlap: offer starts before the period ends and ends after it starts
            availableFrom: LessThanOrEqual(new Date("2026-06-10T00:00:00.000Z")),
            availableTo: MoreThanOrEqual(new Date("2026-06-01T00:00:00.000Z")),
          },
          skip: 10,
        }),
      );
    });

    it("uses a one-sided price bound when only minPrice is set", async () => {
      offersRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.getAll({ ...baseQuery, minPrice: 100 });

      expect(offersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "active", price: MoreThanOrEqual(100) },
        }),
      );
    });
  });

  describe("getById", () => {
    it("returns the offer when found", async () => {
      offersRepository.findOne.mockResolvedValue({ ...offerMock, destination: destinationMock });

      const result = await service.getById(offerMock.id);

      expect(offersRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: offerMock.id }, relations: { destination: true } }),
      );
      expect(result.id).toBe(offerMock.id);
      expect(result).not.toHaveProperty("reservedCapacity");
    });

    it("throws NotFoundException when offer is not found", async () => {
      offersRepository.findOne.mockResolvedValue(null);

      await expect(service.getById(offerMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    const ownerId = faker.string.uuid();
    const createDto = {
      type: OfferType.hotel,
      destinationId: destinationMock.id,
      title: "Sea view hotel",
      price: 120,
      currency: Currency.EUR,
      maxGuests: 2,
      maxConcurrentBookings: 3,
      availableFrom: "2026-06-01T00:00:00.000Z",
      availableTo: "2026-09-01T00:00:00.000Z",
      stars: 4,
      address: "Main street 1",
    };

    it("creates a hotel offer and nulls the fields of other types", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(destinationMock);
      offersRepository.save.mockImplementation(async (offer: object) => ({
        ...offer,
        id: offerMock.id,
        reservedCapacity: 0,
      }));

      const result = await service.create(createDto as never, ownerId);

      expect(offersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "hotel",
          ownerId,
          status: OfferStatus.active,
          description: null,
          stars: 4,
          address: "Main street 1",
          flightNumber: null,
          airline: null,
          durationDays: null,
          includesMeals: null,
        }),
      );
      expect(result).toEqual(expect.objectContaining({ id: offerMock.id, ownerId }));
      expect(result).not.toHaveProperty("reservedCapacity");
    });

    it("defaults includesMeals to false for a tour", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(destinationMock);
      offersRepository.save.mockImplementation(async (offer: object) => offer);

      await service.create(
        { ...createDto, type: OfferType.tour, durationDays: 7, stars: undefined } as never,
        ownerId,
      );

      expect(offersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ durationDays: 7, includesMeals: false, stars: null }),
      );
    });

    it("throws NotFoundException when destination does not exist", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createDto as never, ownerId)).rejects.toThrow(NotFoundException);
      expect(offersRepository.save).not.toHaveBeenCalled();
    });

    it("throws BadRequestException when end date is not after start date", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(destinationMock);

      await expect(
        service.create({ ...createDto, availableTo: createDto.availableFrom } as never, ownerId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("update", () => {
    const ownerId = offerMock.ownerId;

    it("updates the offer when owned by the user", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);
      offersRepository.findOne.mockResolvedValue({ ...offerMock, title: "New title" });

      const result = await service.update(offerMock.id, { title: "New title" } as never, ownerId);

      expect(offersRepository.update).toHaveBeenCalledWith(
        { id: offerMock.id },
        expect.objectContaining({ title: "New title", stars: offerMock.stars, airline: null }),
      );
      expect(result.title).toBe("New title");
    });

    it("throws NotFoundException when offer is not found", async () => {
      offersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(offerMock.id, {} as never, ownerId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("throws ForbiddenException when user is not the owner", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);

      await expect(
        service.update(offerMock.id, { title: "x" } as never, faker.string.uuid()),
      ).rejects.toThrow(ForbiddenException);
      expect(offersRepository.update).not.toHaveBeenCalled();
    });

    it("updates the offer when the user is Admin", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);
      offersRepository.findOne.mockResolvedValue(offerMock);

      await service.update(
        offerMock.id,
        { title: "By admin" } as never,
        faker.string.uuid(),
        UserRole.Admin,
      );

      expect(offersRepository.update).toHaveBeenCalled();
    });

    it("throws BadRequestException when trying to change offer type", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);

      await expect(
        service.update(offerMock.id, { type: OfferType.flight } as never, ownerId),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws BadRequestException when end date is not after start date", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);

      await expect(
        service.update(
          offerMock.id,
          { availableTo: offerMock.availableFrom.toISOString() } as never,
          ownerId,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws NotFoundException when destination does not exist", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);
      destinationsRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(offerMock.id, { destinationId: faker.string.uuid() } as never, ownerId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    const ownerId = offerMock.ownerId;

    it("soft deletes the offer when owned by the user", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);

      await service.delete(offerMock.id, ownerId);

      expect(offersRepository.update).toHaveBeenCalledWith(
        { id: offerMock.id },
        { status: OfferStatus.archived, deletedAt: expect.any(Date) },
      );
    });

    it("throws NotFoundException when offer is not found", async () => {
      offersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(offerMock.id, ownerId)).rejects.toThrow(NotFoundException);
    });

    it("throws ConflictException when user is not the owner", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);

      await expect(service.delete(offerMock.id, faker.string.uuid())).rejects.toThrow(
        ConflictException,
      );
      expect(offersRepository.update).not.toHaveBeenCalled();
    });

    it("soft deletes the offer when the user is Admin", async () => {
      offersRepository.findOneBy.mockResolvedValue(offerMock);

      await service.delete(offerMock.id, faker.string.uuid(), UserRole.Admin);

      expect(offersRepository.update).toHaveBeenCalled();
    });
  });

  describe("hardDelete", () => {
    const ownerId = offerMock.ownerId;

    it("permanently deletes the offer (also a soft-deleted one) when owned by the user", async () => {
      offersRepository.findOne.mockResolvedValue({ ...offerMock, deletedAt: new Date() });

      await service.hardDelete(offerMock.id, ownerId);

      expect(offersRepository.findOne).toHaveBeenCalledWith({
        where: { id: offerMock.id },
        withDeleted: true,
      });
      expect(offersRepository.delete).toHaveBeenCalledWith({ id: offerMock.id });
    });

    it("throws NotFoundException when offer is not found", async () => {
      offersRepository.findOne.mockResolvedValue(null);

      await expect(service.hardDelete(offerMock.id, ownerId)).rejects.toThrow(NotFoundException);
    });

    it("throws ConflictException when user is not the owner", async () => {
      offersRepository.findOne.mockResolvedValue(offerMock);

      await expect(service.hardDelete(offerMock.id, faker.string.uuid())).rejects.toThrow(
        ConflictException,
      );
    });

    it("permanently deletes the offer when the user is Admin", async () => {
      offersRepository.findOne.mockResolvedValue(offerMock);

      await service.hardDelete(offerMock.id, faker.string.uuid(), UserRole.Admin);

      expect(offersRepository.delete).toHaveBeenCalledWith({ id: offerMock.id });
    });
  });
});
