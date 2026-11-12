import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { ILike, Not } from "typeorm";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { OfferEntity } from "../offers/entities/offer.entity";
import { DestinationsService } from "./destinations.service";
import { DestinationEntity } from "./entities/destination.entity";
import { createRepositoryMock } from "../../../tests/mocks/repository.mock";
import { destinationMock } from "../../../tests/mocks/destination.mock";

describe("DestinationsService", () => {
  let service: DestinationsService;
  const destinationsRepository = createRepositoryMock();
  const offersRepository = createRepositoryMock();

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        { provide: getRepositoryToken(DestinationEntity), useValue: destinationsRepository },
        { provide: getRepositoryToken(OfferEntity), useValue: offersRepository },
      ],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("returns a paginated list without filters", async () => {
      destinationsRepository.findAndCount.mockResolvedValue([[destinationMock], 1]);

      const result = await service.getAll({ page: 1, limit: 10 } as never);

      expect(destinationsRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { name: "ASC" },
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

    it("filters by name (case-insensitive) and countryCode", async () => {
      destinationsRepository.findAndCount.mockResolvedValue([[], 25]);

      const result = await service.getAll({
        page: 2,
        limit: 10,
        name: "par",
        countryCode: "FR",
      } as never);

      expect(destinationsRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: ILike("%par%"), countryCode: "FR" },
          skip: 10,
        }),
      );
      expect(result.meta).toEqual(
        expect.objectContaining({ totalPages: 3, hasNextPage: true, hasPreviousPage: true }),
      );
    });
  });

  describe("getById", () => {
    it("returns the destination when found", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(destinationMock);

      await expect(service.getById(destinationMock.id)).resolves.toEqual(destinationMock);
      expect(destinationsRepository.findOneBy).toHaveBeenCalledWith({ id: destinationMock.id });
    });

    it("throws NotFoundException when destination is not found", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getById(destinationMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    const createDto = {
      name: destinationMock.name,
      countryCode: destinationMock.countryCode,
      description: destinationMock.description,
    };

    it("creates the destination when it does not exist", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(null);
      destinationsRepository.save.mockResolvedValue(destinationMock);

      const result = await service.create(createDto);

      expect(destinationsRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(destinationMock);
    });

    it("throws ConflictException when the destination already exists", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(destinationMock);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(destinationsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("updates only the provided fields when found and unique", async () => {
      destinationsRepository.findOneBy
        .mockResolvedValueOnce({ ...destinationMock })
        .mockResolvedValueOnce(null);
      destinationsRepository.save.mockImplementation(async (destination: object) => destination);

      const result = await service.update(destinationMock.id, { name: "New name" });

      expect(destinationsRepository.findOneBy).toHaveBeenNthCalledWith(2, {
        name: "New name",
        countryCode: destinationMock.countryCode,
        id: Not(destinationMock.id),
      });
      // description was not sent: it must stay as is, not become undefined
      expect(result).toEqual({ ...destinationMock, name: "New name" });
    });

    it("throws NotFoundException when destination is not found", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(destinationMock.id, { name: "x" })).rejects.toThrow(
        NotFoundException,
      );
    });

    it("throws ConflictException when the name and countryCode are already taken", async () => {
      destinationsRepository.findOneBy
        .mockResolvedValueOnce(destinationMock)
        .mockResolvedValueOnce({ ...destinationMock, id: "other" });

      await expect(service.update(destinationMock.id, { name: "Taken" })).rejects.toThrow(
        ConflictException,
      );
      expect(destinationsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deletes the destination when it has no offers", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(destinationMock);
      offersRepository.count.mockResolvedValue(0);

      await service.delete(destinationMock.id);

      expect(offersRepository.count).toHaveBeenCalledWith({
        where: { destinationId: destinationMock.id },
        withDeleted: true,
      });
      expect(destinationsRepository.delete).toHaveBeenCalledWith({ id: destinationMock.id });
    });

    it("throws NotFoundException when destination is not found", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(destinationMock.id)).rejects.toThrow(NotFoundException);
    });

    it("throws ConflictException when the destination has offers (soft-deleted included)", async () => {
      destinationsRepository.findOneBy.mockResolvedValue(destinationMock);
      offersRepository.count.mockResolvedValue(2);

      await expect(service.delete(destinationMock.id)).rejects.toThrow(ConflictException);
      expect(destinationsRepository.delete).not.toHaveBeenCalled();
    });
  });
});
