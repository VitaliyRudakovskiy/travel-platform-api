import { z } from "zod";
import { bookingResponseSchema } from "./booking-response.schema";
import { paginatedSchema } from "src/schemas/paginated-response.schema";

export const paginatedBookingResponseSchema = paginatedSchema(bookingResponseSchema);

export type PaginatedBookingResponseDto = z.infer<typeof paginatedBookingResponseSchema>;
