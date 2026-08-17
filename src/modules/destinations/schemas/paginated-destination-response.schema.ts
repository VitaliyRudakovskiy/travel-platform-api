import z from "zod";
import { destinationResponseSchema } from "./destination-response.schema";
import { paginatedSchema } from "src/schemas/paginated-response.schema";

export const paginatedDestinationResponseSchema = paginatedSchema(destinationResponseSchema);

export type PaginatedDestinationResponseDto = z.infer<typeof paginatedDestinationResponseSchema>;
