// Routing table of the API Gateway (spec 3.1). Matching is by path prefix; /internal/* is deliberately absent,
// so service-to-service endpoints are never reachable through the gateway (404).

export const DownstreamService = {
  auth: "auth-service",
  catalog: "catalog-service",
  booking: "booking-service",
  notification: "notification-service",
} as const;
export type DownstreamService = (typeof DownstreamService)[keyof typeof DownstreamService];

// env variable with the base URL of each service (+ local default)
export const SERVICE_URLS: Record<DownstreamService, { env: string; fallback: string }> = {
  "auth-service": { env: "AUTH_SERVICE_URL", fallback: "http://localhost:3001" },
  "catalog-service": { env: "CATALOG_SERVICE_URL", fallback: "http://localhost:3002" },
  "booking-service": { env: "BOOKING_SERVICE_URL", fallback: "http://localhost:3003" },
  "notification-service": { env: "NOTIFICATION_SERVICE_URL", fallback: "http://localhost:3004" },
};

const ROUTES: { prefix: string; service: DownstreamService }[] = [
  { prefix: "/api/v1/users", service: DownstreamService.auth },
  { prefix: "/api/v1/sessions", service: DownstreamService.auth },
  { prefix: "/api/v2/users", service: DownstreamService.auth },
  { prefix: "/api/v2/sessions", service: DownstreamService.auth },
  { prefix: "/api/v2/email-verifications", service: DownstreamService.auth },
  { prefix: "/api/v1/destinations", service: DownstreamService.catalog },
  { prefix: "/api/v1/offers", service: DownstreamService.catalog },
  // not in the spec table, but the endpoint exists since stage II (decision D7)
  { prefix: "/api/v2/destinations", service: DownstreamService.catalog },
  { prefix: "/api/v2/offers", service: DownstreamService.catalog },
  { prefix: "/api/v1/bookings", service: DownstreamService.booking },
  { prefix: "/api/v1/favorites", service: DownstreamService.booking },
  { prefix: "/api/v2/bookings", service: DownstreamService.booking },
  { prefix: "/api/v2/favorites", service: DownstreamService.booking },
  { prefix: "/api/v2/analytics", service: DownstreamService.booking },
  { prefix: "/api/v2/notifications", service: DownstreamService.notification },
];

// "/api/v1/offers" matches "/api/v1/offers" and "/api/v1/offers/..." but not "/api/v1/offersX"
function matchesPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function resolveService(path: string): DownstreamService | null {
  return ROUTES.find((route) => matchesPrefix(path, route.prefix))?.service ?? null;
}

export function apiVersion(path: string): 1 | 2 | null {
  if (matchesPrefix(path, "/api/v1")) {
    return 1;
  }

  if (matchesPrefix(path, "/api/v2")) {
    return 2;
  }

  return null;
}

// /api/v2 routes that don't need an access token (spec 3.1 + decision D6: refresh / logout / email
// confirmation are done WITHOUT a valid access token, and the catalog is public for reading).
const PUBLIC_V2: { method: string; pattern: RegExp }[] = [
  { method: "POST", pattern: /^\/api\/v2\/users\/?$/ },
  { method: "POST", pattern: /^\/api\/v2\/sessions\/?$/ },
  { method: "POST", pattern: /^\/api\/v2\/sessions\/refresh\/?$/ },
  { method: "DELETE", pattern: /^\/api\/v2\/sessions\/?$/ },
  { method: "POST", pattern: /^\/api\/v2\/email-verifications\/?$/ },
  { method: "GET", pattern: /^\/api\/v2\/offers(\/[^/]+)?\/?$/ },
  { method: "GET", pattern: /^\/api\/v2\/destinations(\/[^/]+)?\/?$/ },
];

export function isPublicV2Route(method: string, path: string): boolean {
  return PUBLIC_V2.some((route) => route.method === method && route.pattern.test(path));
}

// spec 2.5: rate limit on GET /api/v1/offers and GET /api/v2/offers (lists and details)
export function isRateLimitedRoute(method: string, path: string): boolean {
  return method === "GET" && /^\/api\/v[12]\/offers(\/|$)/.test(path);
}
