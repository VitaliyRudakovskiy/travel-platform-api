import { UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserResponseDto => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
