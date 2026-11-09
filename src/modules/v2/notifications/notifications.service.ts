import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  type Prisma,
  UserRole,
} from "#prisma";
import { type AuthenticatedUser } from "@shared/auth/authenticated-user";
import { MailService } from "./mail.service";
import { NOTIFICATIONS_BATCH_SIZE, NOTIFICATION_SUBJECTS } from "./models/notification.constants";
import { type NotificationQueryDto } from "./schemas/notification-query.schema";
import { type NotificationResponseDto } from "./schemas/notification-response.schema";
import { type PaginatedNotificationResponseDto } from "./schemas/paginated-notification-response.schema";

export type SendPendingEmailsResult = {
  sent: number;
  failed: number;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
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
      data: notifications.map((notification): NotificationResponseDto => ({
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
      })),
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

  async sendPendingEmails(): Promise<SendPendingEmailsResult> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        status: NotificationStatus.pending,
        channel: NotificationChannel.email,
      },
      orderBy: { createdAt: "asc" },
      take: NOTIFICATIONS_BATCH_SIZE,
      include: { user: { select: { email: true } } },
    });

    const result: SendPendingEmailsResult = { sent: 0, failed: 0 };

    // One failed email must not block the rest of the batch.
    for (const notification of notifications) {
      const payload = notification.payload as Record<string, unknown>;

      try {
        await this.mailService.send(
          notification.user.email,
          NOTIFICATION_SUBJECTS[notification.type],
          this.buildText(notification.type, payload),
        );

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { status: NotificationStatus.sent, sentAt: new Date() },
        });
        result.sent++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { status: NotificationStatus.failed, errorMessage },
        });
        result.failed++;
        this.logger.warn(`Notification ${notification.id} failed: ${errorMessage}`);
      }
    }

    return result;
  }

  private listScope(currentUser: AuthenticatedUser): Prisma.NotificationWhereInput {
    if (currentUser.role === UserRole.Admin) {
      return {};
    }

    if (currentUser.role === UserRole.Agent) {
      return { booking: { offer: { ownerId: currentUser.id } } };
    }

    return { userId: currentUser.id };
  }

  private buildText(type: NotificationType, payload: Record<string, unknown>): string {
    switch (type) {
      case NotificationType.email_verification:
        return `Your email verification token: ${String(payload.token)}\n\nSend it to POST /api/v2/email-verifications to confirm your email.`;
      case NotificationType.booking_confirmed:
        return `Your booking ${String(payload.bookingId)} has been confirmed.`;
      case NotificationType.booking_cancelled:
        return `Your booking ${String(payload.bookingId)} has been cancelled.`;
      case NotificationType.booking_completed:
        return `Your booking ${String(payload.bookingId)} has been completed. Thank you for travelling with us!`;
    }
  }
}
