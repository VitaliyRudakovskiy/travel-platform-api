import { ApiProperty } from "@nestjs/swagger";
import { MIN_GUESTS_COUNT } from "../../models/schema.constants";

export class CreateBooking {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Offer ID to book",
    format: "uuid",
  })
  offerId: string;

  @ApiProperty({
    example: "2024-06-15T00:00:00.000Z",
    description: "Booking start date (ISO 8601)",
    format: "date-time",
  })
  startDate: string;

  @ApiProperty({
    example: "2024-06-20T00:00:00.000Z",
    description: "Booking end date (ISO 8601)",
    format: "date-time",
  })
  endDate: string;

  @ApiProperty({
    example: 2,
    description: "Number of guests",
    minimum: MIN_GUESTS_COUNT,
  })
  guestsCount: number;
}
