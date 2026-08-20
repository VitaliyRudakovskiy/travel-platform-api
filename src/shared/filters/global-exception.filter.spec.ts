import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { GlobalExceptionFilter } from "./global-exception.filter";

function mockHost() {
  const json = vi.fn();
  const response = { status: vi.fn(() => ({ json })), json };
  const request = { url: "/api/v1/users" };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  };
  return { host: host as never, response, json };
}

describe("GlobalExceptionFilter", () => {
  const filter = new GlobalExceptionFilter();

  it("formats HttpException with statusCode, error, message, details, path, timestamp", () => {
    const { host, response, json } = mockHost();
    const error = new NotFoundException("User not found");

    filter.catch(error, host);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      statusCode: 404,
      error: "Not Found",
      message: "User not found",
      details: null,
      path: "/api/v1/users",
      timestamp: expect.any(String),
    });
  });

  it("maps zod validation errors to details", () => {
    const { host, response, json } = mockHost();
    const error = new BadRequestException({
      message: "Validation failed",
      errors: { email: ["Invalid email"] },
    });

    filter.catch(error, host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation failed",
        details: { email: ["Invalid email"] },
      }),
    );
  });

  it.each([
    [new UnauthorizedException("Invalid credentials"), 401, "Unauthorized"],
    [new ConflictException("Email is already taken"), 409, "Conflict"],
  ])("handles %s", (error, status, name) => {
    const { host, response, json } = mockHost();

    filter.catch(error, host);

    expect(response.status).toHaveBeenCalledWith(status);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ statusCode: status, error: name }));
  });

  it("returns generic 500 for unknown exceptions", () => {
    const { host, response, json } = mockHost();

    filter.catch(new Error("boom"), host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Internal server error",
        details: null,
      }),
    );
  });
});
