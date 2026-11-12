import { ApiProperty, OmitType } from "@nestjs/swagger";
import { BookingStatus } from "#booking-prisma";
import { BookingResponse } from "../../../../v1/bookings/schemas/swagger/booking-response";

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
