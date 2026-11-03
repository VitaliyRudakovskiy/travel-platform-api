import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { V1Module } from "@modules/v1/v1.module";
import { V2Module } from "@modules/v2/v2.module";
import { HealthModule } from "@modules/health/health.module";
import { AuthModule } from "@shared/auth/auth.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, HealthModule, V1Module, V2Module],
})
export class AppModule {}
