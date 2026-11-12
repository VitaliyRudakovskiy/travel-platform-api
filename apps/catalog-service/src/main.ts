import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SwaggerModule } from "@nestjs/swagger";
import { configureApp } from "@app/common";
import { CATALOG_PACKAGE, CATALOG_PROTO_PATH } from "@app/contracts";
import { CatalogServiceModule } from "./catalog-service.module";
import { swaggerConfig } from "./swagger.config";

// No `import "dotenv/config"`: it would load the monolith's root .env (see CLAUDE.md, "Stage III services").
async function bootstrap() {
  const app = await NestFactory.create(CatalogServiceModule);

  configureApp(app);

  // Hybrid application: the same Nest app serves HTTP and gRPC (internal read API for booking-service)
  const grpcUrl = process.env.GRPC_URL ?? "0.0.0.0:50052";
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: { package: CATALOG_PACKAGE, protoPath: CATALOG_PROTO_PATH, url: grpcUrl },
  });

  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swaggerConfig), {
    swaggerOptions: { persistAuthorization: true, tagsSorter: "alpha", docExpansion: "none" },
    customSiteTitle: "catalog-service API Docs",
  });

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3002;
  await app.listen(port);

  const logger = new Logger("Bootstrap");
  logger.log(`catalog-service is running on: http://localhost:${port}`);
  logger.log(`catalog-service gRPC is listening on: ${grpcUrl}`);
}

bootstrap();
