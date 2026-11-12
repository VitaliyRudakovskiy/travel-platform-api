import { z } from "zod";
import { paginatedSchema } from "@app/common";
import { notificationResponseSchema } from "./notification-response.schema";

export const paginatedNotificationResponseSchema = paginatedSchema(notificationResponseSchema);

export type PaginatedNotificationResponseDto = z.infer<typeof paginatedNotificationResponseSchema>;
