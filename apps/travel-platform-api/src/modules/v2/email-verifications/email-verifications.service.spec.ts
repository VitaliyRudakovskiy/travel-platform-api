import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash } from "node:crypto";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { userMock } from "@tests/mocks/user.mock";
import { EmailVerificationsService } from "./email-verifications.service";

describe("EmailVerificationsService", () => {
  let service: EmailVerificationsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailVerificationsService,
        providePrisma(),
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue("24h"),
          },
        },
      ],
    }).compile();

    service = module.get<EmailVerificationsService>(EmailVerificationsService);

    prismaServiceMock.$transaction.mockImplementation(async (callback: (tx: unknown) => unknown) =>
      callback(prismaServiceMock),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("issue", () => {
    it("stores a hashed token and a pending email notification", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      prismaServiceMock.emailVerification.deleteMany.mockResolvedValue({ count: 0 });
      prismaServiceMock.emailVerification.create.mockResolvedValue({});
      prismaServiceMock.notification.create.mockResolvedValue({});

      await service.issue(userMock.id);

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userMock.id },
      });
      expect(prismaServiceMock.emailVerification.deleteMany).toHaveBeenCalledWith({
        where: { userId: userMock.id },
      });
      expect(prismaServiceMock.emailVerification.create).toHaveBeenCalledWith({
        data: {
          userId: userMock.id,
          tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
          expiresAt: expect.any(Date),
        },
      });
      expect(prismaServiceMock.notification.create).toHaveBeenCalledWith({
        data: {
          userId: userMock.id,
          type: "email_verification",
          channel: "email",
          status: "pending",
          payload: { token: expect.stringMatching(/^[a-f0-9]{64}$/) },
        },
      });
    });

    it("throws NotFoundException when the user is not found", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.issue(userMock.id)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.$transaction).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the email is already verified", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue({
        ...userMock,
        isEmailVerified: true,
      });

      await expect(service.issue(userMock.id)).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.$transaction).not.toHaveBeenCalled();
    });
  });

  describe("confirm", () => {
    const token = faker.string.hexadecimal({ length: 64, prefix: "" });
    const verification = {
      id: faker.string.uuid(),
      userId: userMock.id,
      tokenHash: createHash("sha256").update(token).digest("hex"),
      expiresAt: faker.date.future(),
    };

    it("marks the user as verified and deletes outstanding tokens", async () => {
      prismaServiceMock.emailVerification.findFirst.mockResolvedValue(verification);
      prismaServiceMock.user.update.mockResolvedValue({
        ...userMock,
        isEmailVerified: true,
      });
      prismaServiceMock.emailVerification.deleteMany.mockResolvedValue({ count: 1 });

      await service.confirm(token);

      expect(prismaServiceMock.emailVerification.findFirst).toHaveBeenCalledWith({
        where: { tokenHash: verification.tokenHash },
      });
      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { id: userMock.id },
        data: { isEmailVerified: true },
      });
      expect(prismaServiceMock.emailVerification.deleteMany).toHaveBeenCalledWith({
        where: { userId: userMock.id },
      });
    });

    it("throws BadRequestException when the token is unknown", async () => {
      prismaServiceMock.emailVerification.findFirst.mockResolvedValue(null);

      await expect(service.confirm(token)).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
    });

    it("throws BadRequestException and deletes the row when the token is expired", async () => {
      prismaServiceMock.emailVerification.findFirst.mockResolvedValue({
        ...verification,
        expiresAt: faker.date.past(),
      });
      prismaServiceMock.emailVerification.delete.mockResolvedValue(verification);

      await expect(service.confirm(token)).rejects.toThrow(BadRequestException);

      expect(prismaServiceMock.emailVerification.delete).toHaveBeenCalledWith({
        where: { id: verification.id },
      });
      expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
    });
  });
});
