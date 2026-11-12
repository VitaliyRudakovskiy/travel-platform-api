import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { provideEmailVerificationsService } from "../../../tests/providers/provide-email-verifications-service";
import { emailVerificationsServiceMock } from "../../../tests/mocks/email-verifications-service.mock";
import { EmailVerificationsController } from "./email-verifications.controller";

describe("EmailVerificationsController", () => {
  let controller: EmailVerificationsController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailVerificationsController],
      providers: [provideEmailVerificationsService()],
    }).compile();

    controller = module.get<EmailVerificationsController>(EmailVerificationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("confirm", () => {
    it("calls emailVerificationsService.confirm with the token", async () => {
      const token = faker.string.hexadecimal({ length: 64, prefix: "" });
      emailVerificationsServiceMock.confirm.mockResolvedValue(undefined);

      await controller.confirm({ token });

      expect(emailVerificationsServiceMock.confirm).toHaveBeenCalledWith(token);
    });
  });
});
