import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AuthServiceModule } from "./auth-service.module";

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  new Logger("Bootstrap").log(`auth-service is running on: http://localhost:${port}`);
}

bootstrap();
