import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthClient } from "./auth-client.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>("AUTH_SERVICE_URL") ?? "http://localhost:3001",
        // spec 4.3: 5 s timeout for service-to-service HTTP calls
        timeout: 5000,
      }),
    }),
  ],
  providers: [AuthClient],
  exports: [AuthClient],
})
export class AuthClientModule {}
