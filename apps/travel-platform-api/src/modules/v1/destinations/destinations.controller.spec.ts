import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { DestinationsController } from "./destinations.controller";
import { provideDestinationsService } from "@tests/providers/provide-destinations-service";
import { destinationsServiceMock } from "@tests/mocks/destinations-service.mock";
import { destinationMock } from "@tests/mocks/destination.mock";

describe("DestinationsController", () => {
  let controller: DestinationsController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinationsController],
      providers: [provideDestinationsService()],
    }).compile();

    controller = module.get<DestinationsController>(DestinationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("get", () => {
    it("calls destinationsService.getAll and returns its result", async () => {
      const query = {
        page: 1,
        limit: 10,
        name: undefined,
        countryCode: undefined,
      };

      const result = {
        data: [destinationMock],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      destinationsServiceMock.getAll.mockResolvedValue(result);

      const response = await controller.get(query);

      expect(destinationsServiceMock.getAll).toHaveBeenCalledWith(query);
      expect(response).toEqual(result);
    });
  });

  describe("getOne", () => {
    it("calls destinationsService.getById and returns its result", async () => {
      destinationsServiceMock.getById.mockResolvedValue(destinationMock);

      const result = await controller.getOne(destinationMock.id);

      expect(destinationsServiceMock.getById).toHaveBeenCalledWith(destinationMock.id);

      expect(result).toEqual(destinationMock);
    });
  });

  describe("create", () => {
    it("calls destinationsService.create and returns its result", async () => {
      const createDestinationDto = {
        name: destinationMock.name,
        countryCode: destinationMock.countryCode,
        description: destinationMock.description,
      };
      destinationsServiceMock.create.mockResolvedValue(destinationMock);

      const result = await controller.create(createDestinationDto);

      expect(destinationsServiceMock.create).toHaveBeenCalledWith(createDestinationDto);
      expect(result).toEqual(destinationMock);
    });
  });

  describe("update", () => {
    it("calls destinationsService.update and returns its result", async () => {
      const updateDestinationDto = {
        name: "Updated City",
      };
      const updatedDestination = { ...destinationMock, name: "Updated City" };
      destinationsServiceMock.update.mockResolvedValue(updatedDestination);

      const result = await controller.update(destinationMock.id, updateDestinationDto);

      expect(destinationsServiceMock.update).toHaveBeenCalledWith(
        destinationMock.id,
        updateDestinationDto,
      );
      expect(result).toEqual(updatedDestination);
    });
  });

  describe("delete", () => {
    it("calls destinationsService.delete with the destination id", async () => {
      destinationsServiceMock.delete.mockResolvedValue(undefined);

      await controller.delete(destinationMock.id);

      expect(destinationsServiceMock.delete).toHaveBeenCalledWith(destinationMock.id);
    });
  });
});
