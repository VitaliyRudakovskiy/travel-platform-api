import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Travel Platform — booking-service")
  .setDescription(
    `
    Bookings, favorites and booking analytics (Prisma, booking_db).

    - Clients call these endpoints through the API Gateway (\`/api/v1\`, \`/api/v2\`) with the same contracts as stages I–II.
    - Protected routes trust the headers set by the gateway: \`X-User-Id\`, \`X-User-Role\`, \`X-Email-Verified\`.
    - Creating a booking is orchestrated with catalog-service (availability, capacity reservation, compensation);
      every booking change is written to the transactional outbox (\`outbox_events\`).
    - The embedded \`offer\` comes from catalog-service and is omitted if it is unavailable.
    `,
  )
  .setVersion("1.0")
  .addBearerAuth()
  .addTag("Bookings", "Bookings management endpoints")
  .addTag("Favorites", "Favorites management endpoints")
  .addTag("Analytics", "Booking analytics (Admin)")
  .build();
