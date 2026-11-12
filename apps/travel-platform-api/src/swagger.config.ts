import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Travel Platform API")
  .setDescription(
    `
    ## Travel Platform API Documentation

      ### Features:
      - User management
      - Authentication
      - Destintaions management
      - Offers management
      - Bookings management
      - Favorites management

      ### Versioning:
      - API uses URI versioning: \`/api/v1/endpoint\` and \`/api/v2/endpoint\`
      - v1 keeps the Stage I contract
      - v2 controllers share the same services
      - v2 protected routes use Bearer JWT (\`Authorization: Bearer <accessToken>\`)
    `,
  )
  .setVersion("1.0")
  .addBearerAuth()
  .addTag("Users", "User management endpoints")
  .addTag("Sessions", "Authentication endpoints")
  .addTag("Destinations", "Destintaions management endpoints")
  .addTag("Offers", "Offers management endpoints")
  .addTag("Bookings", "Bookings management endpoints")
  .addTag("Favorites", "Favorites management endpoints")
  .addServer("http://localhost:4200", "Development server")
  .build();
