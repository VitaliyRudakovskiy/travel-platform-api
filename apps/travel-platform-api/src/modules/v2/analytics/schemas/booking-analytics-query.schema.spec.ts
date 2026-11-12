import { describe, it, expect } from "vitest";
import { bookingAnalyticsQuerySchema } from "./booking-analytics-query.schema";

describe("bookingAnalyticsQuerySchema", () => {
  const validQuery = { from: "2026-11-01", to: "2026-11-30", groupBy: "status" };

  it("applies the default limit of 10", () => {
    expect(bookingAnalyticsQuerySchema.parse(validQuery)).toEqual({ ...validQuery, limit: 10 });
  });

  it("accepts the same date for from and to", () => {
    const result = bookingAnalyticsQuerySchema.safeParse({ ...validQuery, to: validQuery.from });

    expect(result.success).toBe(true);
  });

  it("rejects from later than to", () => {
    const result = bookingAnalyticsQuerySchema.safeParse({
      ...validQuery,
      from: "2026-12-01",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("from must not be later than to");
  });

  it("rejects missing from and to", () => {
    const result = bookingAnalyticsQuerySchema.safeParse({ groupBy: "status" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(["from", "to"]);
  });

  it("rejects an unknown groupBy value", () => {
    const result = bookingAnalyticsQuerySchema.safeParse({ ...validQuery, groupBy: "offer" });

    expect(result.success).toBe(false);
  });

  it("rejects a limit above the maximum", () => {
    const result = bookingAnalyticsQuerySchema.safeParse({ ...validQuery, limit: "101" });

    expect(result.success).toBe(false);
  });
});
