import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { configureApp } from "@app/common";
import { BookingServiceModule } from "./booking-service.module";
import { swaggerConfig } from "./swagger.config";

// No `import "dotenv/config"`: it would load the monolith's root .env (see CLAUDE.md, "Stage III services").
async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);

  configureApp(app);

  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swaggerConfig), {
    swaggerOptions: { persistAuthorization: true, tagsSorter: "alpha", docExpansion: "none" },
    customSiteTitle: "booking-service API Docs",
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);

  new Logger("Bootstrap").log(`booking-service is running on: http://localhost:${port}`);
}

bootstrap();
