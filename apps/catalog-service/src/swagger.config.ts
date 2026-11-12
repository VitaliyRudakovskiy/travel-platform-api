import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Travel Platform — catalog-service")
  .setDescription(
    `
    Destinations and offers (TypeORM, catalog_db).

    - Clients call these endpoints through the API Gateway (\`/api/v1\`, \`/api/v2\`) with the same contracts as stages I–II.
    - Protected routes trust the headers set by the gateway: \`X-User-Id\`, \`X-User-Role\`, \`X-Email-Verified\`.
    - Offers no longer embed \`user\` (users live in auth-service); use \`ownerId\`.
    `,
  )
  .setVersion("1.0")
  .addBearerAuth()
  .addTag("Destinations", "Destinations management endpoints")
  .addTag("Offers", "Offers management endpoints")
  .build();
