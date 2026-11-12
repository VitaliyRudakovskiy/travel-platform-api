import { faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";
import { LIMIT_MAX_VALUE } from "../models/schema.constants";
import { offerQuerySchema } from "./offer-query.schema";

describe("offerQuerySchema", () => {
  it("applies defaults for pagination, status and sorting", () => {
    expect(offerQuerySchema.parse({})).toEqual({
      page: 1,
      limit: 10,
      status: "active",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("parses filters and sorting options", () => {
    const destinationId = faker.string.uuid();
    const availableFrom = "2026-01-01T00:00:00.000Z";
    const availableTo = "2026-12-31T00:00:00.000Z";

    expect(
      offerQuerySchema.parse({
        page: "2",
        limit: "5",
        type: "hotel",
        destinationId,
        minPrice: "100",
        maxPrice: "500",
        availableFrom,
        availableTo,
        status: "archived",
        sortBy: "price",
        sortOrder: "asc",
      }),
    ).toEqual({
      page: 2,
      limit: 5,
      type: "hotel",
      destinationId,
      minPrice: 100,
      maxPrice: 500,
      availableFrom,
      availableTo,
      status: "archived",
      sortBy: "price",
      sortOrder: "asc",
    });
  });

  it("rejects page below minimum", () => {
    expect(() => offerQuerySchema.parse({ page: "0" })).toThrow();
  });

  it("rejects limit above maximum", () => {
    expect(() => offerQuerySchema.parse({ limit: String(LIMIT_MAX_VALUE + 1) })).toThrow();
  });

  it("rejects invalid destination id", () => {
    expect(() => offerQuerySchema.parse({ destinationId: "not-a-uuid" })).toThrow();
  });

  it("rejects invalid availableFrom date", () => {
    expect(() => offerQuerySchema.parse({ availableFrom: "2026-13-01" })).toThrow();
  });

  it("rejects negative minPrice", () => {
    expect(() => offerQuerySchema.parse({ minPrice: "-1" })).toThrow();
  });
});
