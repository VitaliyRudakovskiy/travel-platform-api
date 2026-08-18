import { ApiProperty } from "@nestjs/swagger";
import { LIMIT_MAX_VALUE, LIMIT_MIN_VALUE, PAGE_MIN_VALUE } from "../../models/schema.constants";
import { BookingStatus } from "@prisma/client";

export class BookingQuery {
  @ApiProperty({
    example: "1",
    description: "Page number for pagination",
    minimum: PAGE_MIN_VALUE,
    default: 1,
    required: false,
  })
  page?: string;

  @ApiProperty({
    example: "10",
    description: "Number of items per page",
    minimum: LIMIT_MIN_VALUE,
    maximum: LIMIT_MAX_VALUE,
    default: 10,
    required: false,
  })
  limit?: string;

  @ApiProperty({
    example: "confirmed",
    description: "Filter bookings by status",
    enum: ["draft", "confirmed", "cancelled"],
    required: false,
  })
  status?: BookingStatus;
}
