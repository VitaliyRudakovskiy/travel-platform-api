import { faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";
import { BookingStatus } from "@prisma/client";
import { LIMIT_MAX_VALUE } from "../models/schema.constants";
import { bookingQuerySchema } from "./booking-query.schema";

describe("bookingQuerySchema", () => {
  it("applies defaults for page and limit", () => {
    expect(bookingQuerySchema.parse({})).toEqual({
      page: 1,
      limit: 10,
    });
  });

  it("parses custom pagination values", () => {
    expect(bookingQuerySchema.parse({ page: "2", limit: "5" })).toEqual({
      page: 2,
      limit: 5,
    });
  });

  it("parses optional status filter", () => {
    expect(bookingQuerySchema.parse({ status: BookingStatus.confirmed })).toEqual({
      page: 1,
      limit: 10,
      status: BookingStatus.confirmed,
    });
  });

  it("rejects page below minimum", () => {
    expect(() => bookingQuerySchema.parse({ page: "0" })).toThrow();
  });

  it("rejects limit above maximum", () => {
    expect(() => bookingQuerySchema.parse({ limit: String(LIMIT_MAX_VALUE + 1) })).toThrow();
  });

  it("rejects invalid status", () => {
    expect(() => bookingQuerySchema.parse({ status: faker.lorem.word() })).toThrow();
  });
});
