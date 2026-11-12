import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Travel Platform — auth-service")
  .setDescription(
    `
    Users, sessions (login / refresh / logout), email verification and client profiles.

    - Clients call these endpoints through the API Gateway (\`/api/v1\`, \`/api/v2\`) with the same contracts as stages I–II.
    - Protected routes trust the headers set by the gateway: \`X-User-Id\`, \`X-User-Role\`, \`X-Email-Verified\`.
    `,
  )
  .setVersion("1.0")
  .addBearerAuth()
  .addTag("Users", "User management endpoints")
  .addTag("Sessions", "Authentication endpoints")
  .build();
