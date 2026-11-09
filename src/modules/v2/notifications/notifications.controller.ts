import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NotificationStatus, NotificationType } from "#prisma";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { type AuthenticatedUser } from "@shared/auth/authenticated-user";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { NotificationsService } from "./notifications.service";
import {
  type NotificationQueryDto,
  notificationQuerySchema,
} from "./schemas/notification-query.schema";
import { type PaginatedNotificationResponseDto } from "./schemas/paginated-notification-response.schema";
import { PaginatedNotificationResponse } from "./schemas/swagger/paginated-notification-response";

@ApiTags("Notifications")
@ApiBearerAuth()
@Controller({ path: "notifications", version: "2" })
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: "Get in-app notifications",
    description:
      "Returns a paginated list of in-app notifications. Users see their own notifications, Agents see notifications for bookings of their offers, Admins see all notifications.",
  })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "limit", required: false, example: 10 })
  @ApiQuery({ name: "type", required: false, enum: NotificationType })
  @ApiQuery({ name: "status", required: false, enum: NotificationStatus })
  @ApiResponse({
    status: 200,
    description: "List of notifications retrieved successfully",
    type: PaginatedNotificationResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid query parameters",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  async findAll(
    @Query(new ZodValidationPipe(notificationQuerySchema))
    query: NotificationQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<PaginatedNotificationResponseDto> {
    return this.notificationsService.findAll(query, currentUser);
  }
}
