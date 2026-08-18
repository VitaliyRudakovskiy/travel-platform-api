import z from "zod";
import { createDestinationSchema } from "./create-destination.schema";

export const udpateDestinationSchema = createDestinationSchema.partial();

export type UpdateDestinationDto = z.infer<typeof udpateDestinationSchema>;
