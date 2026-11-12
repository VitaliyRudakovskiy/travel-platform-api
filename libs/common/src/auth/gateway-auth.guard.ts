import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { type AuthenticatedUser } from "./authenticated-user";
import { GATEWAY_HEADERS } from "./gateway-headers";
import { isUserRole } from "./user-role";

type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
};

/**
 * Trusts the identity headers set by the API Gateway (services are reachable only from the Docker network).
 * - no X-User-Id                      -> 401, as the stage I AuthGuard
 * - X-User-Id without a valid role    -> 404 "User not found": the gateway sets the role only for a user that exists
 */
@Injectable()
export class GatewayAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = readHeader(request, GATEWAY_HEADERS.userId);

    if (!userId) {
      throw new UnauthorizedException("X-User-Id header is required");
    }

    const role = readHeader(request, GATEWAY_HEADERS.userRole);

    if (!isUserRole(role)) {
      throw new NotFoundException("User not found");
    }

    request.user = {
      id: userId,
      role,
      isEmailVerified: readHeader(request, GATEWAY_HEADERS.emailVerified) === "true",
    };

    return true;
  }
}

function readHeader(request: RequestWithUser, name: string): string | undefined {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}
