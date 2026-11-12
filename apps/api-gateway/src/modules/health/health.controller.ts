import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";
import { DownstreamService, SERVICE_URLS } from "../../routing/routes";

const PING_TIMEOUT_MS = 3000;

// spec 3.7: the gateway is ready when every downstream service reports ready (their own DB / RabbitMQ checks)
@ApiExcludeController()
@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get("ready")
  @HealthCheck()
  check() {
    return this.health.check(
      Object.values(DownstreamService).map((service) => {
        const { env, fallback } = SERVICE_URLS[service];
        const url = `${this.configService.get<string>(env) ?? fallback}/health/ready`;

        return () => this.http.pingCheck(service, url, { timeout: PING_TIMEOUT_MS });
      }),
    );
  }
}
