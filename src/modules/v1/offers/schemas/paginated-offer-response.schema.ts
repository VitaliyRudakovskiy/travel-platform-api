import { z } from "zod";
import { offerResponseSchema } from "./offer-response.schema";
import { paginatedSchema } from "src/shared/schemas/paginated-response.schema";

export const paginatedOfferResponseSchema = paginatedSchema(offerResponseSchema);

export type PaginatedOfferResponseDto = z.infer<typeof paginatedOfferResponseSchema>;
