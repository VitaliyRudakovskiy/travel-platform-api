import z from "zod";

// GET /internal/v1/offers/:id/availability?startDate&endDate&guestsCount (catalog-service)
export const availabilityQuerySchema = z.object({
  startDate: z.iso.datetime("Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"),
  endDate: z.iso.datetime("Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"),
  guestsCount: z.coerce.number().int().min(1),
});
export type AvailabilityQueryDto = z.infer<typeof availabilityQuerySchema>;

// Why an offer is not available: lets booking-service keep the stage I/II status codes
// (OFFER_NOT_ACTIVE -> 404, INVALID_DATES / DATES_OUT_OF_RANGE / GUESTS_EXCEEDED -> 400, NO_CAPACITY -> 409).
export const UnavailabilityReason = {
  OFFER_NOT_ACTIVE: "OFFER_NOT_ACTIVE",
  INVALID_DATES: "INVALID_DATES",
  DATES_OUT_OF_RANGE: "DATES_OUT_OF_RANGE",
  GUESTS_EXCEEDED: "GUESTS_EXCEEDED",
  NO_CAPACITY: "NO_CAPACITY",
} as const;
export type UnavailabilityReason = (typeof UnavailabilityReason)[keyof typeof UnavailabilityReason];

// Spec shape { available, remainingCapacity } + optional reason/message (extra fields, backward compatible)
export const availabilityResponseSchema = z.object({
  available: z.boolean(),
  remainingCapacity: z.number().int(),
  reason: z.enum(Object.values(UnavailabilityReason)).optional(),
  message: z.string().optional(),
});
export type AvailabilityResponseDto = z.infer<typeof availabilityResponseSchema>;

// PATCH /internal/v1/offers/:id/capacity  { "reservedDelta": 1 } reserve, { "reservedDelta": -1 } compensate
export const capacityChangeSchema = z
  .object({
    reservedDelta: z.union([z.literal(1), z.literal(-1)]),
  })
  .strict();
export type CapacityChangeDto = z.infer<typeof capacityChangeSchema>;

export const capacityResponseSchema = z.object({
  remainingCapacity: z.number().int(),
});
export type CapacityResponseDto = z.infer<typeof capacityResponseSchema>;
