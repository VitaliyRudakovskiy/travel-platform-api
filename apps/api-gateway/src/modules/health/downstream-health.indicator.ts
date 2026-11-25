import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";

export const DOWNSTREAM_PING_TIMEOUT_MS = 3000;

type TerminusDetails = Record<string, { status: string; [key: string]: unknown }>;

/**
 * Checks one service through its own GET /health/ready and keeps the service's checks in the result,
 * so the gateway shows not only "booking-service is down" but also why (postgres / rabbitmq).
 */
@Injectable()
export class DownstreamHealthIndicator {
  constructor(
    private readonly http: HttpService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async check(service: string, url: string) {
    const indicator = this.healthIndicatorService.check(service);

    try {
      const response = await firstValueFrom(
        this.http.get<unknown>(url, {
          timeout: DOWNSTREAM_PING_TIMEOUT_MS,
          // 503 is an answer, not a transport error: read the body to show which dependency failed
          validateStatus: () => true,
        }),
      );
      const checks = serviceChecks(response.data);

      return response.status === 200
        ? indicator.up({ checks })
        : indicator.down({ httpStatus: response.status, checks });
    } catch (error) {
      // no answer at all: the service is not running / not reachable
      const reason = isAxiosError(error) ? (error.code ?? error.message) : String(error);
      return indicator.down({ message: `${service} is unreachable (${reason})` });
    }
  }
}

// 200: Terminus result { status, info, error, details }.
// 503: the service's GlobalExceptionFilter wraps that result into { statusCode, error, ..., details: <result> }.
function serviceChecks(body: unknown): TerminusDetails {
  const data = body as { details?: unknown } | undefined;
  const result = (data?.details as { details?: unknown } | undefined)?.details ?? data?.details;

  return (result ?? {}) as TerminusDetails;
}
