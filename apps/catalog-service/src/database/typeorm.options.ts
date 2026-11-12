import { join } from "node:path";
import { type DataSourceOptions } from "typeorm";
import { DestinationEntity } from "../modules/v1/destinations/entities/destination.entity";
import { OfferEntity } from "../modules/v1/offers/entities/offer.entity";

// One source of truth for the app (TypeOrmModule) and the CLI (data-source.ts).
export function typeOrmOptions(databaseUrl: string | undefined): DataSourceOptions {
  return {
    type: "postgres",
    url: databaseUrl,
    // gen_random_uuid() is built into PostgreSQL 13+; the default uuid_generate_v4() needs the uuid-ossp extension
    uuidExtension: "pgcrypto",
    entities: [DestinationEntity, OfferEntity],
    // The schema is changed only by migrations, exactly like with Prisma (never synchronize in a real DB).
    synchronize: false,
    // .ts when the CLI runs through tsx, .js in the compiled app
    migrations: [join(__dirname, "migrations", "*.{ts,js}")],
    migrationsTableName: "typeorm_migrations",
  };
}
