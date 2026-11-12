// Every service has its own Prisma client, so the shared library can't use a Prisma enum.
// A const object keeps the same call-site syntax as the enum: `UserRole.Admin`.
export const UserRole = {
  Admin: "Admin",
  Agent: "Agent",
  User: "User",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLES = Object.values(UserRole);

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as string[]).includes(value);
}
