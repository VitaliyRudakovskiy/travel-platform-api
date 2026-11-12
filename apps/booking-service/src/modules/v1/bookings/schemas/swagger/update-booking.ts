import { ApiProperty } from "@nestjs/swagger";
import { BookingStatus } from "#booking-prisma";

export class UpdateBooking {
  @ApiProperty({
    example: "confirmed",
    description: "New booking status",
    enum: [BookingStatus.confirmed, BookingStatus.cancelled],
  })
  status: BookingStatus;
}
