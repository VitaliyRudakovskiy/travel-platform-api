import { Module } from "@nestjs/common";
import { V1Module } from "@modules/v1/v1.module";
import { HealthModule } from "@modules/health/health.module";

@Module({
  imports: [HealthModule, V1Module],
})
export class AppModule {}
