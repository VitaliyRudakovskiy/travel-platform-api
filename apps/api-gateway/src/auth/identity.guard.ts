import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { type Request } from "express";
import { GATEWAY_HEADERS } from "@app/common";
import { apiVersion, isPublicV2Route } from "../routing/routes";
import { type Claims, ClaimsService } from "./claims.service";

/**
 * Decides who the caller is and passes it downstream in headers that services trust
 * (X-User-Id, X-User-Role, X-Email-Verified; see GatewayAuthGuard in @app/common).
 *
 * Identity headers sent by the client are ALWAYS removed first: otherwise anyone could
 * send `X-User-Role: Admin` and the services would believe it.
 * - v2: Bearer access token required (except public routes), validated here.
 * - v1: stage I contract — the client sends X-User-Id; the gateway looks the user up and adds the role.
 *   Unknown user -> no role header -> the service answers 404 "User not found", as in stage I.
 */
@Injectable()
export class IdentityGuard implements CanActivate {
  constructor(private readonly claimsService: ClaimsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const clientUserId = header(request, GATEWAY_HEADERS.userId);

    stripIdentityHeaders(request);

    const version = apiVersion(request.path);

    if (version === 1) {
      if (clientUserId) {
        request.headers[GATEWAY_HEADERS.userId] = clientUserId;
        const claims = await this.claimsService.claimsForUserId(clientUserId);

        if (claims) {
          setIdentityHeaders(request, claims);
        }
      }
      return true;
    }

    if (version === 2) {
      if (isPublicV2Route(request.method, request.path)) {
        return true;
      }

      const token = bearerToken(request);

      if (!token) {
        throw new UnauthorizedException("Access token is required");
      }

      setIdentityHeaders(request, await this.claimsService.claimsForToken(token));
    }

    // anything else is not routed (ProxyService answers 404)
    return true;
  }
}

function header(request: Request, name: string): string | undefined {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function stripIdentityHeaders(request: Request): void {
  for (const name of Object.values(GATEWAY_HEADERS)) {
    delete request.headers[name];
  }
}

function setIdentityHeaders(request: Request, claims: Claims): void {
  request.headers[GATEWAY_HEADERS.userId] = claims.id;
  request.headers[GATEWAY_HEADERS.userRole] = claims.role;
  request.headers[GATEWAY_HEADERS.emailVerified] = String(claims.isEmailVerified);
}

function bearerToken(request: Request): string | undefined {
  const authorization = header(request, "authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  return scheme?.toLowerCase() === "bearer" && token ? token : undefined;
}
