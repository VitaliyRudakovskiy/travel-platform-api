import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { type AuthenticatedUser } from "./authenticated-user";

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>().user;

    if (!user) {
      throw new UnauthorizedException("Authentication is required");
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException("Email is not verified");
    }

    return true;
  }
}
