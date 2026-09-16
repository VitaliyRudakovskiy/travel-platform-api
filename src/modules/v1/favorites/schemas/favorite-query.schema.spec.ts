import { describe, it, expect } from "vitest";
import { LIMIT_MAX_VALUE } from "../models/schema.constants";
import { favoriteQuerySchema } from "./favorite-query.schema";

describe("favoriteQuerySchema", () => {
  it("applies defaults for page and limit", () => {
    expect(favoriteQuerySchema.parse({})).toEqual({
      page: 1,
      limit: 10,
    });
  });

  it("parses custom pagination values", () => {
    expect(favoriteQuerySchema.parse({ page: "3", limit: "15" })).toEqual({
      page: 3,
      limit: 15,
    });
  });

  it("rejects page below minimum", () => {
    expect(() => favoriteQuerySchema.parse({ page: "0" })).toThrow();
  });

  it("rejects limit above maximum", () => {
    expect(() => favoriteQuerySchema.parse({ limit: String(LIMIT_MAX_VALUE + 1) })).toThrow();
  });
});
