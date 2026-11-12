// DataSource for the TypeORM CLI (migration:generate / migration:run / seed), not used by the running app.
import { join } from "node:path";
import { config } from "dotenv";
import { DataSource } from "typeorm";
import { typeOrmOptions } from "./typeorm.options";

// apps/catalog-service/.env; variables already set in the environment win (dotenv never overrides)
config({ path: join(__dirname, "..", "..", ".env"), quiet: true });

export default new DataSource(typeOrmOptions(process.env.DATABASE_URL));
