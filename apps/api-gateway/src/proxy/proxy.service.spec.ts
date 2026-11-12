import { NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { PROXY_TIMEOUT_MS, ProxyService } from "./proxy.service";

function request(overrides: Record<string, unknown> = {}) {
  return {
    method: "GET",
    path: "/api/v2/bookings",
    originalUrl: "/api/v2/bookings?page=2",
    ip: "10.0.0.7",
    body: undefined,
    headers: {
      host: "localhost:3000",
      authorization: "Bearer token",
      "content-type": "application/json",
      "idempotency-key": "key-1",
      "x-user-id": "user-1",
      "x-user-role": "User",
      "x-email-verified": "true",
    },
    ...overrides,
  };
}

function response() {
  const res = { setHeader: vi.fn(), status: vi.fn(), send: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}

describe("ProxyService", () => {
  const axiosRef = { request: vi.fn() };
  const config = { get: vi.fn().mockReturnValue(undefined) };
  let service: ProxyService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ProxyService({ axiosRef } as never, config as never);
  });

  it("forwards to the service of the route with path, query, identity headers and a 5 s timeout", async () => {
    axiosRef.request.mockResolvedValue({ status: 200, headers: {}, data: Buffer.from("{}") });

    await service.forward(request() as never, response() as never);

    const options = axiosRef.request.mock.calls[0][0];
    expect(options.url).toBe("http://localhost:3003/api/v2/bookings?page=2");
    expect(options.timeout).toBe(PROXY_TIMEOUT_MS);
    expect(options.headers).toEqual({
      "x-forwarded-for": "10.0.0.7",
      "content-type": "application/json",
      "idempotency-key": "key-1",
      "x-user-id": "user-1",
      "x-user-role": "User",
      "x-email-verified": "true",
    });
    // GET: no body
    expect(options.data).toBeUndefined();
  });

  it("forwards the body (even an empty object) for writes", async () => {
    axiosRef.request.mockResolvedValue({ status: 400, headers: {}, data: Buffer.from("{}") });

    await service.forward(
      request({
        method: "PATCH",
        path: "/api/v2/users/u/profile",
        originalUrl: "/api/v2/users/u/profile",
        body: {},
      }) as never,
      response() as never,
    );

    expect(axiosRef.request.mock.calls[0][0].data).toEqual({});
  });

  it("passes the downstream status, body bytes and content-type through (errors included)", async () => {
    const body = Buffer.from('{"statusCode":409}');
    axiosRef.request.mockResolvedValue({
      status: 409,
      headers: { "content-type": "application/json; charset=utf-8", "x-powered-by": "Express" },
      data: body,
    });
    const res = response();

    await service.forward(request() as never, res as never);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith(body);
    expect(res.setHeader).toHaveBeenCalledWith("content-type", "application/json; charset=utf-8");
    expect(res.setHeader).not.toHaveBeenCalledWith("x-powered-by", expect.anything());
  });

  it.each(["/internal/v1/users/u", "/api/v3/offers"])(
    "answers 404 for the unrouted %s",
    async (path) => {
      await expect(
        service.forward(request({ path, originalUrl: path }) as never, response() as never),
      ).rejects.toThrow(NotFoundException);
      expect(axiosRef.request).not.toHaveBeenCalled();
    },
  );

  it("answers 503 when the service does not answer (refused or timeout)", async () => {
    axiosRef.request.mockRejectedValue(
      Object.assign(new Error("timeout of 5000ms exceeded"), {
        isAxiosError: true,
        code: "ECONNABORTED",
      }),
    );

    await expect(service.forward(request() as never, response() as never)).rejects.toThrow(
      new ServiceUnavailableException("booking-service is unavailable"),
    );
  });
});
