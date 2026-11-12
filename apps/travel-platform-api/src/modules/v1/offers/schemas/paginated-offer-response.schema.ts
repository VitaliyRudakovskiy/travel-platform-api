import { z } from "zod";
import { offerResponseSchema } from "./offer-response.schema";
import { paginatedSchema } from "@app/common";

export const paginatedOfferResponseSchema = paginatedSchema(offerResponseSchema);

export type PaginatedOfferResponseDto = z.infer<typeof paginatedOfferResponseSchema>;
