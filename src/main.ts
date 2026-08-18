import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { swaggerConfig } from "./swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const version = "1";
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "api/v",
    defaultVersion: version,
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
      docExpansion: "none",
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: "Travel Platform API Docs",
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI: http://localhost:${port}/api/docs`);
  console.log(`📌 API URL: http://localhost:${port}/api/v${version}`);
}

bootstrap();
