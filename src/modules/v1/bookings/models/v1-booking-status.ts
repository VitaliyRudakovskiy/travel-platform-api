import { BookingStatus } from "#prisma";

export const V1_BOOKING_STATUSES = ["pending", "confirmed", "cancelled"] as const;

export type V1BookingStatus = (typeof V1_BOOKING_STATUSES)[number];

export function toV1BookingStatus(status: BookingStatus): V1BookingStatus {
  if (status === BookingStatus.completed) {
    return "confirmed";
  }

  return status;
}

export function fromV1BookingStatus(status: V1BookingStatus): BookingStatus {
  return status;
}
