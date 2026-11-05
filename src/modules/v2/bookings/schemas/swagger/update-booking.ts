import { ApiProperty } from "@nestjs/swagger";
import { BookingStatus } from "#prisma";

export class V2UpdateBooking {
  @ApiProperty({
    example: "confirmed",
    description: "New booking status",
    enum: [BookingStatus.confirmed, BookingStatus.completed, BookingStatus.cancelled],
  })
  status: BookingStatus;
}
