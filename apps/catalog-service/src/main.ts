import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CatalogServiceModule } from "./catalog-service.module";

async function bootstrap() {
  const app = await NestFactory.create(CatalogServiceModule);
  const port = process.env.PORT ?? 3002;
  await app.listen(port);

  new Logger("Bootstrap").log(`catalog-service is running on: http://localhost:${port}`);
}

bootstrap();
