import { ApiProperty } from "@nestjs/swagger";
import { BOOKING_ANALYTICS_GROUP_BY } from "../../models/analytics.constants";

export class BookingAnalyticsItem {
  @ApiProperty({
    description: "Group key: booking status, or destination UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  key: string;

  @ApiProperty({
    description: "Human-readable label: booking status, or destination name",
    example: "Paris",
  })
  label: string;

  @ApiProperty({
    description: "Number of bookings created in the period",
    example: 12,
  })
  count: number;
}

export class BookingAnalyticsResponse {
  @ApiProperty({
    description: "Grouping field",
    enum: BOOKING_ANALYTICS_GROUP_BY,
    example: "destination",
  })
  groupBy: (typeof BOOKING_ANALYTICS_GROUP_BY)[number];

  @ApiProperty({ description: "Period start (inclusive)", example: "2026-11-01" })
  from: string;

  @ApiProperty({ description: "Period end (inclusive)", example: "2026-11-30" })
  to: string;

  @ApiProperty({
    description: "Booking counts per group, sorted by count descending",
    type: [BookingAnalyticsItem],
  })
  data: BookingAnalyticsItem[];
}
