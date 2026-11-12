import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { GlobalExceptionFilter } from "@app/common";
import { ApiGatewayModule } from "./api-gateway.module";
import { DownstreamService } from "./routing/routes";

// No `import "dotenv/config"`: it would load the monolith's root .env (see CLAUDE.md, "Stage III services").
async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Unified error format for the gateway's own errors (401, 404, 429, 503); downstream errors are passed through.
  // No enableVersioning here: /api/v1 and /api/v2 are routed by the proxy, versions are handled by the services.
  app.useGlobalFilters(new GlobalExceptionFilter());

  // The gateway has no API of its own: the UI lists the OpenAPI documents of the services (explorer dropdown)
  const emptyDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle("Travel Platform — API Gateway").addBearerAuth().build(),
  );
  SwaggerModule.setup("api/docs", app, emptyDocument, {
    explorer: true,
    customSiteTitle: "Travel Platform API (gateway)",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      urls: Object.values(DownstreamService).map((service) => ({
        url: `/docs/${service}/openapi.json`,
        name: service,
      })),
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  new Logger("Bootstrap").log(`api-gateway is running on: http://localhost:${port}`);
}

bootstrap();
