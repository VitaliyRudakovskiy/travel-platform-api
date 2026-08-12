import z from "zod";

export const destinationResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  countryCode: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DestinationResponseDto = z.infer<typeof destinationResponseSchema>;
