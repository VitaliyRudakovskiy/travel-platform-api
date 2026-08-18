import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Travel Platform API")
  .setDescription("API documentation for Travel Platform")
  .setVersion("1.0")
  .build();
