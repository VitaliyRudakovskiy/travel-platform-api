import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { configureApp } from "@app/common";
import { NotificationServiceModule } from "./notification-service.module";

const swaggerConfig = new DocumentBuilder()
  .setTitle("Travel Platform — notification-service")
  .setDescription(
    `
    In-app notifications (GET /api/v2/notifications) and email delivery to Mailhog.

    - Notifications are created from RabbitMQ events (exchange \`travel.events\`, queue \`travel.notifications\`);
      a redelivered event (same \`eventId\`) creates nothing.
    - Protected routes trust the headers set by the gateway: \`X-User-Id\`, \`X-User-Role\`, \`X-Email-Verified\`.
    `,
  )
  .setVersion("1.0")
  .addBearerAuth()
  .addTag("Notifications", "In-app notifications")
  .build();

// No `import "dotenv/config"`: it would load the monolith's root .env (see CLAUDE.md, "Stage III services").
async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);

  configureApp(app);

  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swaggerConfig), {
    swaggerOptions: { persistAuthorization: true, docExpansion: "none" },
    customSiteTitle: "notification-service API Docs",
  });

  const port = process.env.PORT ?? 3004;
  await app.listen(port);

  new Logger("Bootstrap").log(`notification-service is running on: http://localhost:${port}`);
}

bootstrap();
