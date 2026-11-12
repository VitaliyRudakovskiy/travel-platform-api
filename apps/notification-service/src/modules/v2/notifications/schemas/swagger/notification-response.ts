import { ApiProperty } from "@nestjs/swagger";
import { NotificationChannel, NotificationStatus, NotificationType } from "#notify-prisma";

export class NotificationResponse {
  @ApiProperty({
    description: "Notification UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "Recipient user UUID",
    example: "123e4567-e89b-12d3-a456-426614174001",
    format: "uuid",
  })
  userId: string;

  @ApiProperty({
    description: "Related booking UUID (null for non-booking notifications)",
    example: "123e4567-e89b-12d3-a456-426614174002",
    format: "uuid",
    nullable: true,
    type: String,
  })
  bookingId: string | null;

  @ApiProperty({
    description: "Notification type",
    enum: NotificationType,
    example: NotificationType.booking_confirmed,
  })
  type: NotificationType;

  @ApiProperty({
    description: "Delivery channel",
    enum: NotificationChannel,
    example: NotificationChannel.in_app,
  })
  channel: NotificationChannel;

  @ApiProperty({
    description: "Delivery status",
    enum: NotificationStatus,
    example: NotificationStatus.sent,
  })
  status: NotificationStatus;

  @ApiProperty({
    description: "Notification data",
    type: "object",
    additionalProperties: true,
    example: { bookingId: "123e4567-e89b-12d3-a456-426614174002" },
  })
  payload: Record<string, unknown>;

  @ApiProperty({
    description: "Error description when status is failed",
    example: null,
    nullable: true,
    type: String,
  })
  errorMessage: string | null;

  @ApiProperty({
    description: "Creation date",
    example: "2026-11-09T10:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Delivery date, null until sent",
    example: "2026-11-09T10:00:00.000Z",
    nullable: true,
    type: Date,
  })
  sentAt: Date | null;
}
