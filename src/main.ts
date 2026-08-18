import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const version = "1";
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "api/v",
    defaultVersion: version,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📌 API Version: v${version}`);
  console.log(`📌 API URL: http://localhost:${port}/api/v${version}`);
}

bootstrap();
