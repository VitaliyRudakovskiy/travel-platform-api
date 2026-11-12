import { describe, it, expect } from "vitest";
import { apiVersion, isPublicV2Route, isRateLimitedRoute, resolveService } from "./routes";

describe("gateway routes", () => {
  it.each([
    ["/api/v1/users", "auth-service"],
    ["/api/v1/sessions", "auth-service"],
    ["/api/v2/users/123/profile", "auth-service"],
    ["/api/v2/sessions/refresh", "auth-service"],
    ["/api/v2/email-verifications", "auth-service"],
    ["/api/v1/destinations", "catalog-service"],
    ["/api/v1/offers/abc", "catalog-service"],
    ["/api/v2/destinations", "catalog-service"],
    ["/api/v2/offers", "catalog-service"],
    ["/api/v1/bookings/status/abc", "booking-service"],
    ["/api/v1/favorites", "booking-service"],
    ["/api/v2/bookings/abc/status", "booking-service"],
    ["/api/v2/favorites/check/abc", "booking-service"],
    ["/api/v2/analytics/bookings", "booking-service"],
    ["/api/v2/notifications", "notification-service"],
  ])("routes %s to %s", (path, service) => {
    expect(resolveService(path)).toBe(service);
  });

  it.each([
    "/internal/v1/users/abc",
    "/api/v1/internal/v1/users/abc",
    "/api/v3/offers",
    "/api/v1/offersX",
    "/api/v2/notifications-admin",
  ])("does not route %s", (path) => {
    expect(resolveService(path)).toBeNull();
  });

  it.each([
    ["/api/v1/offers", 1],
    ["/api/v2/bookings", 2],
    ["/api/v3/offers", null],
  ])("detects the API version of %s", (path, version) => {
    expect(apiVersion(path)).toBe(version);
  });

  it.each([
    ["POST", "/api/v2/users", true],
    ["POST", "/api/v2/sessions", true],
    ["POST", "/api/v2/sessions/refresh", true],
    ["DELETE", "/api/v2/sessions", true],
    ["POST", "/api/v2/email-verifications", true],
    ["GET", "/api/v2/offers", true],
    ["GET", "/api/v2/offers/abc", true],
    ["GET", "/api/v2/destinations/abc", true],
    ["GET", "/api/v2/users", false],
    ["GET", "/api/v2/users/abc/profile", false],
    ["POST", "/api/v2/offers", false],
    ["PATCH", "/api/v2/offers/abc", false],
    ["POST", "/api/v2/users/abc/email-verifications", false],
    ["GET", "/api/v2/bookings", false],
  ])("%s %s is public: %s", (method, path, expected) => {
    expect(isPublicV2Route(method, path)).toBe(expected);
  });

  it.each([
    ["GET", "/api/v1/offers", true],
    ["GET", "/api/v2/offers/abc", true],
    ["POST", "/api/v2/offers", false],
    ["GET", "/api/v1/destinations", false],
    ["GET", "/api/v2/bookings", false],
  ])("%s %s is rate limited: %s", (method, path, expected) => {
    expect(isRateLimitedRoute(method, path)).toBe(expected);
  });
});
