import { All, Controller, Req, Res, UseGuards } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { type Request, type Response } from "express";
import { IdentityGuard } from "../auth/identity.guard";
import { OffersThrottlerGuard } from "../throttle/offers-throttler.guard";
import { ProxyService } from "./proxy.service";

// One catch-all route instead of http-proxy-middleware: Nest guards (rate limit, JWT) and the global
// exception filter apply to every proxied request. Order: the cheap rate-limit check runs first.
@ApiExcludeController()
@Controller()
@UseGuards(OffersThrottlerGuard, IdentityGuard)
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All(["api", "api/*path"])
  async proxy(@Req() request: Request, @Res() response: Response): Promise<void> {
    await this.proxyService.forward(request, response);
  }
}
