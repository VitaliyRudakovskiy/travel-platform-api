import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";

@Module({
  // HttpHealthIndicator needs HttpModule in the same module
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
