import { HttpService } from "@nestjs/axios";
import { Injectable, Logger, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isAxiosError } from "axios";
import { type Request, type Response } from "express";
import { GATEWAY_HEADERS } from "@app/common";
import { type DownstreamService, resolveService, SERVICE_URLS } from "../routing/routes";

// spec 4.3: 5 s timeout for service-to-service HTTP calls
export const PROXY_TIMEOUT_MS = 5000;

// Request headers passed downstream (everything else, e.g. Host / Connection / Content-Length, is hop-by-hop
// or recalculated). The Authorization header is not needed: services trust the identity headers instead.
const FORWARDED_REQUEST_HEADERS = [
  "content-type",
  "accept",
  "accept-language",
  "user-agent",
  "idempotency-key",
  ...Object.values(GATEWAY_HEADERS),
];

const FORWARDED_RESPONSE_HEADERS = ["content-type", "cache-control", "location", "etag"];

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly baseUrls: Record<DownstreamService, string>;

  constructor(
    private readonly http: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrls = Object.fromEntries(
      Object.entries(SERVICE_URLS).map(([service, { env, fallback }]) => [
        service,
        configService.get<string>(env) ?? fallback,
      ]),
    ) as Record<DownstreamService, string>;
  }

  async forward(request: Request, response: Response): Promise<void> {
    const service = resolveService(request.path);

    if (!service) {
      // includes /internal/*: never exposed through the gateway
      throw new NotFoundException(`Cannot ${request.method} ${request.path}`);
    }

    const headers: Record<string, string> = {
      "x-forwarded-for": request.ip ?? "",
    };

    for (const name of FORWARDED_REQUEST_HEADERS) {
      const value = request.headers[name];
      if (typeof value === "string") {
        headers[name] = value;
      }
    }

    try {
      const downstream = await this.http.axiosRef.request<Buffer>({
        method: request.method,
        url: `${this.baseUrls[service]}${request.originalUrl}`, // path + query string as received
        data: hasBody(request) ? request.body : undefined,
        headers,
        timeout: PROXY_TIMEOUT_MS,
        // the service's own 4xx/5xx (already in the unified error format) are passed through as is
        validateStatus: () => true,
        // keep the body bytes untouched: no JSON re-serialization
        responseType: "arraybuffer",
      });

      for (const name of FORWARDED_RESPONSE_HEADERS) {
        const value = downstream.headers[name];
        if (typeof value === "string") {
          response.setHeader(name, value);
        }
      }

      response.status(downstream.status).send(downstream.data);
    } catch (error) {
      // no response at all: connection refused, DNS, timeout
      this.logger.error(
        `${service} did not answer ${request.method} ${request.originalUrl}: ${describe(error)}`,
      );
      throw new ServiceUnavailableException(`${service} is unavailable`);
    }
  }
}

// Express 5 leaves req.body undefined when there is no body; an explicit {} is forwarded as is
// (e.g. PATCH /profile with {} must still reach the service and get its 400).
function hasBody(request: Request): boolean {
  return request.body !== undefined && !["GET", "HEAD"].includes(request.method);
}

function describe(error: unknown): string {
  if (isAxiosError(error)) {
    return error.code ?? error.message;
  }

  return error instanceof Error ? error.message : String(error);
}
