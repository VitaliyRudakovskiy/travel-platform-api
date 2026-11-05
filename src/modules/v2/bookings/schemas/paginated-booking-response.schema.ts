import { z } from "zod";
import { paginatedSchema } from "@shared/schemas/paginated-response.schema";
import { v2BookingResponseSchema } from "./booking-response.schema";

export const v2PaginatedBookingResponseSchema = paginatedSchema(v2BookingResponseSchema);

export type V2PaginatedBookingResponseDto = z.infer<typeof v2PaginatedBookingResponseSchema>;
