import { type INestApplication } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { assertTestDatabaseName } from "../setup/test-database";

const TABLES = [
  "notifications",
  "idempotency_keys",
  "email_verifications",
  "user_sessions",
  "favorites",
  "bookings",
  "offers",
  "destinations",
  "client_profiles",
  "users",
];

export function getPrisma(app: INestApplication): PrismaService {
  return app.get(PrismaService, { strict: false });
}

export async function resetDatabase(app: INestApplication): Promise<void> {
  const prisma = getPrisma(app);

  const [{ name }] = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  assertTestDatabaseName(name);

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`);
}
