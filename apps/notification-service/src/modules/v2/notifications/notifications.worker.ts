import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { NotificationsService } from "./notifications.service";
import { NOTIFICATIONS_WORKER_INTERVAL_MS } from "./models/notification.constants";

@Injectable()
export class NotificationsWorker {
  private readonly logger = new Logger(NotificationsWorker.name);
  private isRunning = false;

  constructor(private readonly notificationsService: NotificationsService) {}

  @Interval(NOTIFICATIONS_WORKER_INTERVAL_MS)
  async handlePendingEmails(): Promise<void> {
    // Skip the tick if the previous run is still sending (slow SMTP must not cause overlapping runs).
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const { sent, failed, deferred } = await this.notificationsService.sendPendingEmails();

      if (sent || failed || deferred) {
        this.logger.log(`Emails processed: ${sent} sent, ${failed} failed, ${deferred} deferred`);
      }
    } catch (error) {
      this.logger.error(
        "Notifications worker run failed",
        error instanceof Error ? error.stack : error,
      );
    } finally {
      this.isRunning = false;
    }
  }
}
