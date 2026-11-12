import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CATALOG_PACKAGE, CATALOG_PROTO_PATH } from "@app/contracts";
import {
  CATALOG_GRPC_CLIENT,
  CatalogClient,
  INTERNAL_CALL_TIMEOUT_MS,
} from "./catalog-client.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>("CATALOG_HTTP_URL") ?? "http://localhost:3002",
        // spec 4.3: 5 s timeout for service-to-service HTTP calls
        timeout: INTERNAL_CALL_TIMEOUT_MS,
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: CATALOG_GRPC_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: CATALOG_PACKAGE,
            protoPath: CATALOG_PROTO_PATH,
            url: configService.get<string>("CATALOG_GRPC_URL") ?? "localhost:50052",
          },
        }),
      },
    ]),
  ],
  providers: [CatalogClient],
  exports: [CatalogClient],
})
export class CatalogClientModule {}
