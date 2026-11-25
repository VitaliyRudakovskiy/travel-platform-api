import { Controller, Get, HttpException, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { DownstreamService, SERVICE_URLS } from "../../routing/routes";
import { DownstreamHealthIndicator } from "./downstream-health.indicator";
import { RedisHealthIndicator } from "./redis-health.indicator";

/**
 * spec 3.7: the gateway is ready when every downstream service is ready.
 * - `info` / `error` / `details`: one entry per service with the service's own checks (postgres, rabbitmq)
 * - `cache.redis`: the gateway's Redis, informational only (see RedisHealthIndicator)
 * 200 when all services are up, 503 otherwise (Redis does not affect the status code).
 */
@ApiExcludeController()
@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly downstream: DownstreamHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get("ready")
  @HealthCheck()
  async check() {
    const servicesCheck = this.health
      .check(
        Object.values(DownstreamService).map((service) => {
          const { env, fallback } = SERVICE_URLS[service];
          const url = `${this.configService.get<string>(env) ?? fallback}/health/ready`;

          return () => this.downstream.check(service, url);
        }),
      )
      .then(
        (result) => ({ ok: true as const, result }),
        (error: unknown) => ({ ok: false as const, error }),
      );

    const [cache, services] = await Promise.all([this.redis.check(), servicesCheck]);

    if (services.ok) {
      return { ...services.result, cache: { redis: cache } };
    }

    // Terminus throws a 503 with the full result as its body: keep the status, add the cache section
    if (services.error instanceof HttpException) {
      throw new ServiceUnavailableException({
        ...(services.error.getResponse() as object),
        cache: { redis: cache },
      });
    }

    throw services.error;
  }
}
