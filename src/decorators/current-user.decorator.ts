import { UserResponseDto } from "@modules/users/schemas/user-response.schema";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserResponseDto => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
