import { z } from "zod";
import { bookingResponseSchema } from "./booking-response.schema";
import { paginatedSchema } from "@app/common";

export const paginatedBookingResponseSchema = paginatedSchema(bookingResponseSchema);

export type PaginatedBookingResponseDto = z.infer<typeof paginatedBookingResponseSchema>;
