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
      - API uses URI versioning: \`/api/v1/endpoint\`
      - Current version: v1
    `,
  )
  .setVersion("1.0")
  .addTag("Users", "User management endpoints")
  .addTag("Sessions", "Authentication endpoints")
  .addTag("Destinations", "Destintaions management endpoints")
  .addTag("Offers", "Offers management endpoints")
  .addTag("Bookings", "Bookings management endpoints")
  .addTag("Favorites", "Favorites management endpoints")
  .addServer("http://localhost:4200", "Development server")
  .build();
