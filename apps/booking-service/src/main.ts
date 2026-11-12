import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { BookingServiceModule } from "./booking-service.module";

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);
  const port = process.env.PORT ?? 3003;
  await app.listen(port);

  new Logger("Bootstrap").log(`booking-service is running on: http://localhost:${port}`);
}

bootstrap();
