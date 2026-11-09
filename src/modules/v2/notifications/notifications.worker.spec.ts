import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { provideNotificationsService } from "@tests/providers/provide-notifications-service";
import { notificationsServiceMock } from "@tests/mocks/notifications-service.mock";
import { NotificationsWorker } from "./notifications.worker";

describe("NotificationsWorker", () => {
  let worker: NotificationsWorker;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsWorker, provideNotificationsService()],
    }).compile();

    worker = module.get<NotificationsWorker>(NotificationsWorker);
  });

  describe("handlePendingEmails", () => {
    it("delegates sending to the notifications service", async () => {
      notificationsServiceMock.sendPendingEmails.mockResolvedValue({ sent: 2, failed: 0 });

      await worker.handlePendingEmails();

      expect(notificationsServiceMock.sendPendingEmails).toHaveBeenCalledTimes(1);
    });

    it("skips a tick while the previous run is still in progress", async () => {
      let finishRun: ((value: { sent: number; failed: number }) => void) | undefined;
      notificationsServiceMock.sendPendingEmails.mockReturnValueOnce(
        new Promise((resolve) => {
          finishRun = resolve;
        }),
      );

      const firstRun = worker.handlePendingEmails();
      await worker.handlePendingEmails();

      expect(notificationsServiceMock.sendPendingEmails).toHaveBeenCalledTimes(1);

      finishRun?.({ sent: 0, failed: 0 });
      await firstRun;
    });

    it("does not throw and allows the next run when the service fails", async () => {
      notificationsServiceMock.sendPendingEmails
        .mockRejectedValueOnce(new Error("Database unavailable"))
        .mockResolvedValueOnce({ sent: 0, failed: 0 });

      await expect(worker.handlePendingEmails()).resolves.toBeUndefined();
      await worker.handlePendingEmails();

      expect(notificationsServiceMock.sendPendingEmails).toHaveBeenCalledTimes(2);
    });
  });
});
