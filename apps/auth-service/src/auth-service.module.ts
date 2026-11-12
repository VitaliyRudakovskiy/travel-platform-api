import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { InternalUsersModule } from "./modules/internal/users/internal-users.module";
import { V1Module } from "./modules/v1/v1.module";
import { V2Module } from "./modules/v2/v2.module";
import { TokenModule } from "./token/token.module";

@Module({
  imports: [
    // Only this service's env file; variables already set in the environment (Docker) take precedence.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "apps/auth-service/.env" }),
    TokenModule,
    V1Module,
    V2Module,
    InternalUsersModule,
  ],
})
export class AuthServiceModule {}
