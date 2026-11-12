import { describe, beforeEach, it, expect, vi } from "vitest";
import { type OutboxService } from "./outbox.service";
import { OutboxWorker } from "./outbox.worker";

describe("OutboxWorker", () => {
  const outboxService = { publishPendingEvents: vi.fn() };
  let worker: OutboxWorker;

  beforeEach(() => {
    vi.resetAllMocks();
    worker = new OutboxWorker(outboxService as unknown as OutboxService);
  });

  it("delegates a tick to OutboxService", async () => {
    outboxService.publishPendingEvents.mockResolvedValue({
      published: 1,
      failed: 0,
      skipped: false,
    });

    await worker.publishPendingEvents();

    expect(outboxService.publishPendingEvents).toHaveBeenCalledOnce();
  });

  it("skips a tick while the previous run is still in progress", async () => {
    let finish: (() => void) | undefined;
    outboxService.publishPendingEvents.mockReturnValue(
      new Promise((resolve) => {
        finish = () => resolve({ published: 0, failed: 0, skipped: false });
      }),
    );

    const first = worker.publishPendingEvents();
    await worker.publishPendingEvents(); // overlapping tick
    finish?.();
    await first;

    expect(outboxService.publishPendingEvents).toHaveBeenCalledOnce();
  });

  it("keeps working after a failed run", async () => {
    outboxService.publishPendingEvents
      .mockRejectedValueOnce(new Error("booking_db is down"))
      .mockResolvedValueOnce({ published: 0, failed: 0, skipped: false });

    await expect(worker.publishPendingEvents()).resolves.toBeUndefined();
    await worker.publishPendingEvents();

    expect(outboxService.publishPendingEvents).toHaveBeenCalledTimes(2);
  });
});
