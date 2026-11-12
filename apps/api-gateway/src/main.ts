import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ApiGatewayModule } from "./api-gateway.module";

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  new Logger("Bootstrap").log(`api-gateway is running on: http://localhost:${port}`);
}

bootstrap();
