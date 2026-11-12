import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { OUTBOX_WORKER_INTERVAL_MS } from "./outbox.constants";
import { OutboxService } from "./outbox.service";

@Injectable()
export class OutboxWorker {
  private readonly logger = new Logger(OutboxWorker.name);
  private isRunning = false;
  private brokerWasDown = false;

  constructor(private readonly outboxService: OutboxService) {}

  @Interval(OUTBOX_WORKER_INTERVAL_MS)
  async publishPendingEvents(): Promise<void> {
    // Skip the tick if the previous run is still publishing (a slow broker must not cause overlapping runs).
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const { published, failed, skipped } = await this.outboxService.publishPendingEvents();

      if (skipped !== this.brokerWasDown) {
        // log the transition only, not every 5 s while RabbitMQ is down
        if (skipped) {
          this.logger.warn("RabbitMQ is unavailable: outbox events stay pending");
        } else {
          this.logger.log("RabbitMQ is back: publishing pending outbox events");
        }
        this.brokerWasDown = skipped;
      }

      if (published || failed) {
        this.logger.log(`Outbox events processed: ${published} published, ${failed} failed`);
      }
    } catch (error) {
      this.logger.error("Outbox worker run failed", error instanceof Error ? error.stack : error);
    } finally {
      this.isRunning = false;
    }
  }
}
