import { type UserRole } from "./user-role";

// The user as seen by a downstream service: built from the headers set by the API Gateway.
export type AuthenticatedUser = {
  id: string;
  role: UserRole;
  isEmailVerified: boolean;
};
