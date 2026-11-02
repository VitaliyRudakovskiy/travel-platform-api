import { Module } from "@nestjs/common";
import { V1Module } from "@modules/v1/v1.module";
import { V2Module } from "@modules/v2/v2.module";
import { HealthModule } from "@modules/health/health.module";

@Module({
  imports: [HealthModule, V1Module, V2Module],
})
export class AppModule {}
