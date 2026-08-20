import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { DestinationsService } from "./destinations.service";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { destinationMock } from "@tests/mocks/destination.mock";

describe("DestinationsService", () => {
  let service: DestinationsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DestinationsService, providePrisma()],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    const query = {
      page: 1,
      limit: 10,
      name: undefined,
      countryCode: undefined,
    };

    it("returns a paginated list without filters", async () => {
      prismaServiceMock.destination.count.mockResolvedValue(1);
      prismaServiceMock.destination.findMany.mockResolvedValue([destinationMock]);

      const result = await service.getAll(query);

      expect(prismaServiceMock.destination.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(prismaServiceMock.destination.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { name: "asc" },
      });

      expect(result).toEqual({
        data: [destinationMock],
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

    it("filters by name and countryCode", async () => {
      const filteredQuery = {
        page: 2,
        limit: 5,
        name: "Eiffel",
        countryCode: "FR",
      };
      prismaServiceMock.destination.count.mockResolvedValue(12);
      prismaServiceMock.destination.findMany.mockResolvedValue([destinationMock]);

      await service.getAll(filteredQuery);

      expect(prismaServiceMock.destination.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: "Eiffel", mode: "insensitive" },
          countryCode: "FR",
        },
        skip: 5,
        take: 5,
        orderBy: { name: "asc" },
      });

      const result = await service.getAll(filteredQuery);
      expect(result.meta).toEqual({
        total: 12,
        page: 2,
        limit: 5,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });
  });

  describe("getById", () => {
    it("returns the destination when found", async () => {
      prismaServiceMock.destination.findFirst.mockResolvedValue(destinationMock);

      const result = await service.getById(destinationMock.id);

      expect(prismaServiceMock.destination.findFirst).toHaveBeenCalledWith({
        where: { id: destinationMock.id },
      });
      expect(result).toEqual(destinationMock);
    });

    it("throws NotFoundException when destination is not found", async () => {
      prismaServiceMock.destination.findFirst.mockResolvedValue(null);

      await expect(service.getById(destinationMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    const createDestinationDto = {
      name: faker.location.city(),
      countryCode: faker.string.alpha({ length: 2 }).toUpperCase(),
      description: faker.lorem.sentence(),
    };

    it("creates the destination when it does not exist", async () => {
      prismaServiceMock.destination.findFirst.mockResolvedValue(null);
      prismaServiceMock.destination.create.mockResolvedValue(destinationMock);

      const result = await service.create(createDestinationDto);

      expect(prismaServiceMock.destination.findFirst).toHaveBeenCalledWith({
        where: {
          name: createDestinationDto.name,
          countryCode: createDestinationDto.countryCode,
        },
      });
      expect(prismaServiceMock.destination.create).toHaveBeenCalledWith({
        data: {
          name: createDestinationDto.name,
          description: createDestinationDto.description,
          countryCode: createDestinationDto.countryCode,
        },
      });
      expect(result).toEqual(destinationMock);
    });

    it("throws ConflictException when the destination already exists", async () => {
      prismaServiceMock.destination.findFirst.mockResolvedValue(destinationMock);

      await expect(service.create(createDestinationDto)).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.destination.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    const updateDestinationDto = {
      name: faker.location.city(),
      countryCode: faker.string.alpha({ length: 2 }).toUpperCase(),
      description: faker.lorem.sentence(),
    };

    it("updates the destination when found and unique", async () => {
      const updatedDestination = {
        ...destinationMock,
        name: updateDestinationDto.name,
      };
      prismaServiceMock.destination.findUnique.mockResolvedValue(destinationMock);
      prismaServiceMock.destination.findFirst.mockResolvedValue(null);
      prismaServiceMock.destination.update.mockResolvedValue(updatedDestination);

      const result = await service.update(destinationMock.id, updateDestinationDto);

      expect(prismaServiceMock.destination.findUnique).toHaveBeenCalledWith({
        where: { id: destinationMock.id },
      });
      expect(prismaServiceMock.destination.update).toHaveBeenCalledWith({
        where: { id: destinationMock.id },
        data: {
          name: updateDestinationDto.name,
          countryCode: updateDestinationDto.countryCode,
          description: updateDestinationDto.description,
        },
      });
      expect(result).toEqual(updatedDestination);
    });

    it("throws NotFoundException when destination is not found", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue(null);

      await expect(service.update(destinationMock.id, updateDestinationDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaServiceMock.destination.update).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the name and countryCode are already taken", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue(destinationMock);
      prismaServiceMock.destination.findFirst.mockResolvedValue(destinationMock);

      await expect(service.update(destinationMock.id, updateDestinationDto)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaServiceMock.destination.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deletes the destination when it has no offers", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue({
        ...destinationMock,
        _count: { offers: 0 },
      });
      prismaServiceMock.destination.delete.mockResolvedValue(destinationMock);

      await service.delete(destinationMock.id);

      expect(prismaServiceMock.destination.findUnique).toHaveBeenCalledWith({
        where: { id: destinationMock.id },
        include: {
          _count: { select: { offers: true } },
        },
      });
      expect(prismaServiceMock.destination.delete).toHaveBeenCalledWith({
        where: { id: destinationMock.id },
      });
    });

    it("throws NotFoundException when destination is not found", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue(null);

      await expect(service.delete(destinationMock.id)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.destination.delete).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the destination has offers", async () => {
      prismaServiceMock.destination.findUnique.mockResolvedValue({
        ...destinationMock,
        _count: { offers: 3 },
      });

      await expect(service.delete(destinationMock.id)).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.destination.delete).not.toHaveBeenCalled();
    });
  });
});
