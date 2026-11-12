// Headers the API Gateway sets after authenticating a request (lower-case: Node normalizes header names).
export const GATEWAY_HEADERS = {
  userId: "x-user-id",
  userRole: "x-user-role",
  emailVerified: "x-email-verified",
} as const;
