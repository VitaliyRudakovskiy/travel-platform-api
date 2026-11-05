import { ApiProperty, OmitType } from "@nestjs/swagger";
import { BookingStatus } from "#prisma";
import { BookingResponse } from "@modules/v1/bookings/schemas/swagger/booking-response";

export class V2BookingResponse extends OmitType(BookingResponse, ["status"] as const) {
  @ApiProperty({
    example: "pending",
    description: "Booking status",
    enum: [
      BookingStatus.pending,
      BookingStatus.confirmed,
      BookingStatus.completed,
      BookingStatus.cancelled,
    ],
  })
  status: BookingStatus;
}
