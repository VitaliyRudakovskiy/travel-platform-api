import { type ValueTransformer } from "typeorm";

// The `pg` driver returns NUMERIC as a string ("120.00") to avoid precision loss.
// The API contract (Zod offerResponseSchema) expects a number, so convert on read.
export const decimalTransformer: ValueTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};
