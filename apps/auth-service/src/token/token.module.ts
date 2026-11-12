import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

// auth-service only ISSUES access tokens (payload { sub, role }). Validating them on incoming requests
// moved to the API Gateway (stage III), so there is no JwtStrategy / passport-jwt here.
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn:
            configService.get<`${number}m` | `${number}d` | `${number}h`>(
              "JWT_ACCESS_EXPIRES_IN",
            ) ?? "15m",
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class TokenModule {}
