import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "@services/prisma.service";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { RolesGuard } from "@shared/guards/roles.guard";
import { JwtStrategy } from "./jwt.strategy";

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
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
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard, PrismaService],
  exports: [JwtModule, PassportModule, JwtAuthGuard, RolesGuard, JwtStrategy],
})
export class AuthModule {}
