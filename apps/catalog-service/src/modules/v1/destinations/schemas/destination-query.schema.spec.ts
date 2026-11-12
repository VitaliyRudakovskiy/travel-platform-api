import { faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";
import { LIMIT_MAX_VALUE } from "../models/schema.constants";
import { destinationQuerySchema } from "./destination-query.schema";

describe("destinationQuerySchema", () => {
  it("applies defaults for page and limit", () => {
    expect(destinationQuerySchema.parse({})).toEqual({
      page: 1,
      limit: 10,
    });
  });

  it("parses custom pagination values", () => {
    expect(destinationQuerySchema.parse({ page: "2", limit: "25" })).toEqual({
      page: 2,
      limit: 25,
    });
  });

  it("trims name and parses valid country code", () => {
    expect(
      destinationQuerySchema.parse({
        name: "  Paris  ",
        countryCode: "FR",
      }),
    ).toEqual({
      page: 1,
      limit: 10,
      name: "Paris",
      countryCode: "FR",
    });
  });

  it("rejects lowercase country code", () => {
    expect(() => destinationQuerySchema.parse({ countryCode: "fr" })).toThrow();
  });

  it("rejects page below minimum", () => {
    expect(() => destinationQuerySchema.parse({ page: "0" })).toThrow();
  });

  it("rejects limit above maximum", () => {
    expect(() => destinationQuerySchema.parse({ limit: String(LIMIT_MAX_VALUE + 1) })).toThrow();
  });

  it("rejects invalid country code format", () => {
    expect(() => destinationQuerySchema.parse({ countryCode: faker.string.alpha(3) })).toThrow();
  });
});
