import { z } from "zod";
import { bookingResponseSchema } from "./booking-response.schema";
import { paginatedSchema } from "@shared/schemas/paginated-response.schema";

export const paginatedBookingResponseSchema = paginatedSchema(bookingResponseSchema);

export type PaginatedBookingResponseDto = z.infer<typeof paginatedBookingResponseSchema>;
