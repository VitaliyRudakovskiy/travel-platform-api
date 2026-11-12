import { ApiProperty } from "@nestjs/swagger";
import { V2BookingResponse } from "./booking-response";
import { type V2BookingResponseDto } from "../booking-response.schema";

export class V2PaginatedBookingResponse {
  @ApiProperty({
    description: "List of bookings",
    type: [V2BookingResponse],
  })
  data: V2BookingResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: "object",
    properties: {
      total: {
        type: "number",
        example: 100,
        description: "Total number of bookings",
      },
      page: { type: "number", example: 1, description: "Current page" },
      limit: { type: "number", example: 10, description: "Items per page" },
      totalPages: { type: "number", example: 10, description: "Total pages" },
      hasNextPage: {
        type: "boolean",
        example: true,
        description: "Has next page",
      },
      hasPreviousPage: {
        type: "boolean",
        example: false,
        description: "Has previous page",
      },
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
