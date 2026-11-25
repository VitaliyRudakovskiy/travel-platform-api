import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "../../redis/redis.module";

const REDIS_PING_TIMEOUT_MS = 1000;

export type RedisCacheStatus =
  | { status: "up" }
  | { status: "down"; message: string; impact: string };

/**
 * Redis is only the JWT-claims cache: when it is down the gateway keeps working (it asks auth-service
 * on every request). So its state is reported in a separate `cache` section and never turns /health/ready
 * into 503 (that would mark the whole stack unhealthy in Docker for a non-critical dependency).
 */
@Injectable()
export class RedisHealthIndicator {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async check(): Promise<RedisCacheStatus> {
    try {
      await Promise.race([
        this.redis.ping(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("ping timeout")), REDIS_PING_TIMEOUT_MS),
        ),
      ]);
      return { status: "up" };
    } catch (error) {
      return {
        status: "down",
        message: error instanceof Error ? error.message : String(error),
        impact: "JWT claims are not cached: every request asks auth-service",
      };
    }
  }
}
