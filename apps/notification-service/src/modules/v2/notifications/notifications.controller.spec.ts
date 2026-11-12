import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { type AuthenticatedUser } from "@app/common";
import { providePrisma } from "../../../tests/providers/provide-prisma";
import { provideNotificationsService } from "../../../tests/providers/provide-notifications-service";
import { notificationsServiceMock } from "../../../tests/mocks/notifications-service.mock";
import { notificationMock } from "../../../tests/mocks/notification.mock";
import { userMock } from "../../../tests/mocks/user.mock";
import { NotificationsController } from "./notifications.controller";

describe("NotificationsController v2", () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [provideNotificationsService(), providePrisma()],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("passes the query and current user to the service and returns its result", async () => {
      const currentUser = { ...userMock, isEmailVerified: true } as unknown as AuthenticatedUser;
      const query = { page: 1, limit: 10, type: "booking_confirmed" as const };
      const response = {
        data: [notificationMock],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      notificationsServiceMock.findAll.mockResolvedValue(response);

      const result = await controller.findAll(query, currentUser);

      expect(notificationsServiceMock.findAll).toHaveBeenCalledWith(query, currentUser);
      expect(result).toEqual(response);
    });
  });
});
