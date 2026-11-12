import { BadRequestException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, it, expect } from "vitest";
import z from "zod";
import { ZodValidationPipe } from "./zod-validation.pipe";

const testSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

describe("ZodValidationPipe", () => {
  const pipe = new ZodValidationPipe(testSchema);

  it("returns parsed data for valid input", () => {
    const value = {
      email: faker.internet.email(),
      name: faker.person.firstName(),
    };

    expect(pipe.transform(value)).toEqual(value);
  });

  it("throws BadRequestException for invalid input", () => {
    expect(() => pipe.transform({ email: "invalid", name: "" })).toThrow(BadRequestException);
  });

  it("includes validation message and errors in exception response", () => {
    try {
      pipe.transform({ email: "invalid" });
      expect.fail("Expected BadRequestException to be thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        message: "Validation failed",
        errors: expect.any(Object),
      });
    }
  });
});
