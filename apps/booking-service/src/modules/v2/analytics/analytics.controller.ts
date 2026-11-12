import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserRole, GatewayAuthGuard, RolesGuard, Roles, ZodValidationPipe } from "@app/common";
import { AnalyticsService } from "./analytics.service";
import {
  type BookingAnalyticsQueryDto,
  bookingAnalyticsQuerySchema,
} from "./schemas/booking-analytics-query.schema";
import { type BookingAnalyticsResponseDto } from "./schemas/booking-analytics-response.schema";
import { BookingAnalyticsResponse } from "./schemas/swagger/booking-analytics-response";
import { ANALYTICS_LIMIT_DEFAULT, BOOKING_ANALYTICS_GROUP_BY } from "./models/analytics.constants";

@ApiTags("Analytics")
@ApiBearerAuth()
@Controller({ path: "analytics", version: "2" })
@UseGuards(GatewayAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("bookings")
  @ApiOperation({
    summary: "Booking analytics",
    description:
      "Counts bookings created in the period [from, to] (inclusive, UTC days), grouped by status or destination and sorted by count descending. Admin only.",
  })
  @ApiQuery({ name: "from", required: true, example: "2026-11-01" })
  @ApiQuery({ name: "to", required: true, example: "2026-11-30" })
  @ApiQuery({ name: "groupBy", required: true, enum: BOOKING_ANALYTICS_GROUP_BY })
  @ApiQuery({ name: "limit", required: false, example: ANALYTICS_LIMIT_DEFAULT })
  @ApiResponse({
    status: 200,
    description: "Aggregated booking counts",
    type: BookingAnalyticsResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid query parameters or from is later than to",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin role required",
  })
  async getBookingStats(
    @Query(new ZodValidationPipe(bookingAnalyticsQuerySchema))
    query: BookingAnalyticsQueryDto,
  ): Promise<BookingAnalyticsResponseDto> {
    return this.analyticsService.getBookingStats(query);
  }
}
