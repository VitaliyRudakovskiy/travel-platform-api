import { Global, Inject, Logger, Module, type OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export const REDIS_CLIENT = Symbol("REDIS_CLIENT");

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        const logger = new Logger("Redis");
        const client = new Redis(
          configService.get<string>("REDIS_URL") ?? "redis://localhost:6379",
          {
            // Redis is only a cache: when it is down, commands must fail fast (the gateway then asks
            // auth-service directly) instead of waiting in the offline queue.
            enableOfflineQueue: false,
            maxRetriesPerRequest: 1,
          },
        );

        client.on("ready", () => logger.log("Connected to Redis"));
        client.on("error", (error) => logger.warn(`Redis error: ${error.message}`));

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    await this.redis.quit().catch(() => undefined);
  }
}
