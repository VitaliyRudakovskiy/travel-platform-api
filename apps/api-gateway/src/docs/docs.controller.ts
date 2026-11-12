import { HttpService } from "@nestjs/axios";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { type DownstreamService, SERVICE_URLS } from "../routing/routes";
import { PROXY_TIMEOUT_MS } from "../proxy/proxy.service";

// Aggregated Swagger (spec 4.2): the gateway UI lists one OpenAPI document per service, fetched from the
// service's own /api/docs-json. The paths are identical at the gateway, so "Try it out" goes through it.
@ApiExcludeController()
@Controller("docs")
export class DocsController {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get(":service/openapi.json")
  async openApi(@Param("service") service: string): Promise<unknown> {
    const config = SERVICE_URLS[service as DownstreamService];

    if (!config) {
      throw new NotFoundException(`Unknown service ${service}`);
    }

    const baseUrl = this.configService.get<string>(config.env) ?? config.fallback;

    try {
      const response = await firstValueFrom(
        this.http.get(`${baseUrl}/api/docs-json`, { timeout: PROXY_TIMEOUT_MS }),
      );
      return response.data;
    } catch {
      throw new ServiceUnavailableException(`${service} is unavailable`);
    }
  }
}
