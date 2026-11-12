import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import {
  type BookingEvent,
  BookingEventType,
  type EmailVerificationNotificationDto,
} from "@app/contracts";
import { type AuthenticatedUser, UserRole } from "@app/common";
import {
  type Notification,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  type Prisma,
} from "#notify-prisma";
import { PrismaService } from "../../../prisma/prisma.service";
import { AuthClient } from "../../auth-client/auth-client.service";
import { MailService } from "./mail.service";
import { NOTIFICATIONS_BATCH_SIZE, NOTIFICATION_SUBJECTS } from "./models/notification.constants";
import { type NotificationQueryDto } from "./schemas/notification-query.schema";
import { type NotificationResponseDto } from "./schemas/notification-response.schema";
import { type PaginatedNotificationResponseDto } from "./schemas/paginated-notification-response.schema";

export type SendPendingEmailsResult = {
  sent: number;
  failed: number;
  // left pending for the next tick (auth-service unreachable)
  deferred: number;
};

const STATUS_NOTIFICATION_TYPES: Partial<Record<string, NotificationType>> = {
  confirmed: NotificationType.booking_confirmed,
  cancelled: NotificationType.booking_cancelled,
  completed: NotificationType.booking_completed,
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly authClient: AuthClient,
  ) {}

  async findAll(
    query: NotificationQueryDto,
    currentUser: AuthenticatedUser,
  ): Promise<PaginatedNotificationResponseDto> {
    const { page, limit, type, status } = query;

    // Only in-app notifications are exposed: email payloads may contain secrets (verification token).
    const where: Prisma.NotificationWhereInput = {
      ...this.listScope(currentUser),
      channel: NotificationChannel.in_app,
      ...(type && { type }),
      ...(status && { status }),
    };

    const [total, notifications] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: notifications.map((notification) => this.toResponse(notification)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Idempotent consumer side: one event -> an email (pending, sent later by the worker) and an in-app
   * notification (delivered by being stored). The unique (eventId, channel) index + skipDuplicates make a
   * redelivered event a no-op: RabbitMQ and the outbox both deliver at-least-once.
   * Returns the number of rows actually created (0 for a duplicate).
   */
  async createFromBookingEvent(event: BookingEvent): Promise<number> {
    const type =
      event.type === BookingEventType.created
        ? NotificationType.booking_created
        : STATUS_NOTIFICATION_TYPES[event.toStatus];

    if (!type) {
      return 0; // a transition nobody is notified about
    }

    const common = {
      userId: event.userId,
      bookingId: event.bookingId,
      offerOwnerId: event.offerOwnerId,
      eventId: event.eventId,
      type,
      payload: event,
    };

    const { count } = await this.prisma.notification.createMany({
      data: [
        { ...common, channel: NotificationChannel.email, status: NotificationStatus.pending },
        {
          ...common,
          channel: NotificationChannel.in_app,
          status: NotificationStatus.sent,
          sentAt: new Date(),
        },
      ],
      skipDuplicates: true,
    });

    return count;
  }

  // Called by auth-service (internal API). The email is known here, so it is stored in the email payload,
  // which is never returned by the API (only in-app notifications are listed).
  async createEmailVerification(dto: EmailVerificationNotificationDto): Promise<void> {
    await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: NotificationType.email_verification,
        channel: NotificationChannel.email,
        status: NotificationStatus.pending,
        payload: { token: dto.token, email: dto.email },
      },
    });
  }

  async sendPendingEmails(): Promise<SendPendingEmailsResult> {
    const notifications = await this.prisma.notification.findMany({
      where: { status: NotificationStatus.pending, channel: NotificationChannel.email },
      orderBy: { createdAt: "asc" },
      take: NOTIFICATIONS_BATCH_SIZE,
    });

    const result: SendPendingEmailsResult = { sent: 0, failed: 0, deferred: 0 };
    const emails = new Map<string, string>(); // userId -> email, one lookup per user per batch

    // One failed email must not block the rest of the batch.
    for (const notification of notifications) {
      const payload = notification.payload as Record<string, unknown>;
      let to: string;

      try {
        to = await this.recipient(notification, payload, emails);
      } catch (error) {
        if (error instanceof NotFoundException) {
          await this.markFailed(notification.id, error.message);
          result.failed++;
        } else {
          // auth-service is down: not the email's fault, try again on the next tick
          result.deferred++;
        }
        continue;
      }

      try {
        await this.mailService.send(
          to,
          NOTIFICATION_SUBJECTS[notification.type],
          this.buildText(notification.type, payload),
        );

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { status: NotificationStatus.sent, sentAt: new Date() },
        });
        result.sent++;
      } catch (error) {
        const errorMessage = describeError(error);

        await this.markFailed(notification.id, errorMessage);
        result.failed++;
        this.logger.warn(`Notification ${notification.id} failed: ${errorMessage}`);
      }
    }

    return result;
  }

  private async recipient(
    notification: Notification,
    payload: Record<string, unknown>,
    cache: Map<string, string>,
  ): Promise<string> {
    if (typeof payload.email === "string") {
      return payload.email; // email verification: the address came with the request
    }

    const cached = cache.get(notification.userId);

    if (cached) {
      return cached;
    }

    const { email } = await this.authClient.getUser(notification.userId);
    cache.set(notification.userId, email);

    return email;
  }

  private async markFailed(id: string, errorMessage: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { status: NotificationStatus.failed, errorMessage },
    });
  }

  private listScope(currentUser: AuthenticatedUser): Prisma.NotificationWhereInput {
    if (currentUser.role === UserRole.Admin) {
      return {};
    }

    if (currentUser.role === UserRole.Agent) {
      // stage II joined booking -> offer; the owner id now comes with the event
      return { offerOwnerId: currentUser.id };
    }

    return { userId: currentUser.id };
  }

  private toResponse(notification: Notification): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      bookingId: notification.bookingId,
      type: notification.type,
      channel: notification.channel,
      status: notification.status,
      payload: notification.payload as Record<string, unknown>,
      errorMessage: notification.errorMessage,
      createdAt: notification.createdAt,
      sentAt: notification.sentAt,
    };
  }

  private buildText(type: NotificationType, payload: Record<string, unknown>): string {
    const booking = payload.offerTitle
      ? `"${String(payload.offerTitle)}" (booking ${String(payload.bookingId)})`
      : `${String(payload.bookingId)}`;

    switch (type) {
      case NotificationType.email_verification:
        return `Your email verification token: ${String(payload.token)}\n\nSend it to POST /api/v2/email-verifications to confirm your email.`;
      case NotificationType.booking_created:
        return `Your booking ${booking} has been created and is waiting for confirmation.`;
      case NotificationType.booking_confirmed:
        return `Your booking ${booking} has been confirmed.`;
      case NotificationType.booking_cancelled:
        return `Your booking ${booking} has been cancelled.`;
      case NotificationType.booking_completed:
        return `Your booking ${booking} has been completed. Thank you for travelling with us!`;
    }
  }
}

// Connecting to "localhost" tries ::1 and 127.0.0.1: Node then throws an AggregateError with an EMPTY message
// and the real causes in `errors`. Keep errorMessage useful for the stored notification.
function describeError(error: unknown): string {
  if (error instanceof AggregateError && error.errors.length > 0) {
    return error.errors.map((inner) => describeError(inner)).join("; ");
  }

  if (error instanceof Error) {
    const code = (error as { code?: unknown }).code;
    return error.message || (code ? String(code) : error.name);
  }

  return String(error);
}
