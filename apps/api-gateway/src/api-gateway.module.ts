import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { ClaimsService } from "./auth/claims.service";
import { IdentityGuard } from "./auth/identity.guard";
import { DocsController } from "./docs/docs.controller";
import { ProxyController } from "./proxy/proxy.controller";
import { PROXY_TIMEOUT_MS, ProxyService } from "./proxy/proxy.service";
import { RedisModule } from "./redis/redis.module";
import { OffersThrottlerGuard } from "./throttle/offers-throttler.guard";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    HealthModule,
    // Only this service's env file; variables already set in the environment (Docker) take precedence.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "apps/api-gateway/.env" }),
    HttpModule.register({ timeout: PROXY_TIMEOUT_MS }),
    // Verifies tokens issued by auth-service: the secret must be the same (signing is not done here)
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
      }),
    }),
    // spec 2.5: 100 requests per minute per IP (applied to GET offers only, see OffersThrottlerGuard)
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
      errorMessage: "Too many requests: the offers catalog allows 100 requests per minute per IP",
    }),
    RedisModule,
  ],
  controllers: [DocsController, ProxyController],
  providers: [ProxyService, ClaimsService, IdentityGuard, OffersThrottlerGuard],
})
export class ApiGatewayModule {}
