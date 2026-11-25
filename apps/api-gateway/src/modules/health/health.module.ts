import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { DownstreamHealthIndicator } from "./downstream-health.indicator";
import { HealthController } from "./health.controller";
import { RedisHealthIndicator } from "./redis-health.indicator";

// REDIS_CLIENT comes from the global RedisModule
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [DownstreamHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
