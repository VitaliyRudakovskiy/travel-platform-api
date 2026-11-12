import z from "zod";

export const idempotencyKeySchema = z
  .string({ error: "Idempotency-Key header is required" })
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    "Idempotency-Key must be a UUID v4",
  );

export type IdempotencyKeyDto = z.infer<typeof idempotencyKeySchema>;
