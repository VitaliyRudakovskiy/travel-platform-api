import { UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { UserRole } from "#prisma";

export type AuthenticatedUser = UserResponseDto & {
  role: UserRole;
  isEmailVerified: boolean;
};
