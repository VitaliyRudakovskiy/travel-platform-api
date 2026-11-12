import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { Currency } from "#auth-prisma";
import { providePrisma } from "../../../tests/providers/provide-prisma";
import { prismaServiceMock } from "../../../tests/mocks/prisma-service.mock";
import { clientProfileMock } from "../../../tests/mocks/client-profile.mock";
import { ClientProfilesService } from "./client-profiles.service";

describe("ClientProfilesService", () => {
  let service: ClientProfilesService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientProfilesService, providePrisma()],
    }).compile();

    service = module.get<ClientProfilesService>(ClientProfilesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getByUserId", () => {
    it("returns the profile when found", async () => {
      prismaServiceMock.clientProfile.findUnique.mockResolvedValue(clientProfileMock);

      const result = await service.getByUserId(clientProfileMock.userId);

      expect(prismaServiceMock.clientProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: clientProfileMock.userId },
      });
      expect(result).toEqual({
        id: clientProfileMock.id,
        userId: clientProfileMock.userId,
        firstName: clientProfileMock.firstName,
        lastName: clientProfileMock.lastName,
        phone: clientProfileMock.phone,
        preferredCurrency: clientProfileMock.preferredCurrency,
        createdAt: clientProfileMock.createdAt,
        updatedAt: clientProfileMock.updatedAt,
      });
    });

    it("throws NotFoundException when the profile is missing", async () => {
      prismaServiceMock.clientProfile.findUnique.mockResolvedValue(null);

      await expect(service.getByUserId(clientProfileMock.userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("update", () => {
    const updateProfileDto = {
      firstName: faker.person.firstName(),
      preferredCurrency: Currency.USD,
    };

    it("updates the profile when found", async () => {
      const updatedProfile = { ...clientProfileMock, ...updateProfileDto };
      prismaServiceMock.clientProfile.findUnique.mockResolvedValue(clientProfileMock);
      prismaServiceMock.clientProfile.update.mockResolvedValue(updatedProfile);

      const result = await service.update(clientProfileMock.userId, updateProfileDto);

      expect(prismaServiceMock.clientProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: clientProfileMock.userId },
      });
      expect(prismaServiceMock.clientProfile.update).toHaveBeenCalledWith({
        where: { userId: clientProfileMock.userId },
        data: updateProfileDto,
      });
      expect(result).toEqual({
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        phone: updatedProfile.phone,
        preferredCurrency: updatedProfile.preferredCurrency,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
      });
    });

    it("throws NotFoundException when the profile is missing", async () => {
      prismaServiceMock.clientProfile.findUnique.mockResolvedValue(null);

      await expect(service.update(clientProfileMock.userId, updateProfileDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaServiceMock.clientProfile.update).not.toHaveBeenCalled();
    });
  });
});
