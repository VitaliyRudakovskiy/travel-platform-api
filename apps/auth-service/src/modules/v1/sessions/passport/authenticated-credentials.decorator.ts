import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { type User } from "#auth-prisma";

// The full user record put on `request.user` by LocalStrategy. Never returned to the client as is:
// SessionsService maps it to a response DTO (passwordHash must not leave the service).
export const AuthenticatedCredentials = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User =>
    context.switchToHttp().getRequest<{ user: User }>().user,
);
