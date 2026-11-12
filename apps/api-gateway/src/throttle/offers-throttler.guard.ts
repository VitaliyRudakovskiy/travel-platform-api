import { type ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { type Request } from "express";
import { isRateLimitedRoute } from "../routing/routes";

// spec 2.5: 100 requests per minute from one IP on GET /api/v1/offers and GET /api/v2/offers only.
// The default tracker is the client IP (req.ip). Counters live in memory: there is one gateway instance
// (several instances would need a shared store, e.g. Redis).
@Injectable()
export class OffersThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return !isRateLimitedRoute(request.method, request.path);
  }
}
