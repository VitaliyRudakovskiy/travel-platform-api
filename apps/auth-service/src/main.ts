import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { configureApp } from "@app/common";
import { AuthServiceModule } from "./auth-service.module";
import { swaggerConfig } from "./swagger.config";

// No `import "dotenv/config"` here: it would load the monolith's root .env, and its DATABASE_URL would win
// (dotenv never overrides). ConfigModule loads apps/auth-service/.env instead.
async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  configureApp(app);

  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swaggerConfig), {
    swaggerOptions: { persistAuthorization: true, tagsSorter: "alpha", docExpansion: "none" },
    customSiteTitle: "auth-service API Docs",
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  new Logger("Bootstrap").log(`auth-service is running on: http://localhost:${port}`);
}

bootstrap();
