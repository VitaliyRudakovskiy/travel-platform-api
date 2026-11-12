import z from "zod";
import { destinationResponseSchema } from "./destination-response.schema";
import { paginatedSchema } from "@app/common";

export const paginatedDestinationResponseSchema = paginatedSchema(destinationResponseSchema);

export type PaginatedDestinationResponseDto = z.infer<typeof paginatedDestinationResponseSchema>;
