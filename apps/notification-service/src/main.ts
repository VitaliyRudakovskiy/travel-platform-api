import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NotificationServiceModule } from "./notification-service.module";

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const port = process.env.PORT ?? 3004;
  await app.listen(port);

  new Logger("Bootstrap").log(`notification-service is running on: http://localhost:${port}`);
}

bootstrap();
