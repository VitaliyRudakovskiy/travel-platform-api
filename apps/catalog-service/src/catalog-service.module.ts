import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmOptions } from "./database/typeorm.options";
import { InternalOffersModule } from "./modules/internal/offers/internal-offers.module";
import { V1Module } from "./modules/v1/v1.module";
import { V2Module } from "./modules/v2/v2.module";

@Module({
  imports: [
    // Only this service's env file; variables already set in the environment (Docker) take precedence.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "apps/catalog-service/.env" }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...typeOrmOptions(configService.getOrThrow<string>("DATABASE_URL")),
        // Apply pending migrations on startup (convenient for Docker); the schema still changes only via migrations
        migrationsRun: true,
      }),
    }),
    V1Module,
    V2Module,
    InternalOffersModule,
  ],
})
export class CatalogServiceModule {}
