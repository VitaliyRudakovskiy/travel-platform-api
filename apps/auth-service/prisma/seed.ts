// Dev/test users for auth_db: `pnpm seed:auth` (idempotent, safe to re-run).
// Fixed ids: catalog-service seed (stage III step 2) uses the agent id as offers' ownerId.
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import { PrismaClient, UserRole } from "#auth-prisma";

export const SEED_PASSWORD = "Password123!";

export const SEED_USERS = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    username: "admin",
    email: "admin@travel.local",
    role: UserRole.Admin,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    username: "agent",
    email: "agent@travel.local",
    role: UserRole.Agent,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    username: "user",
    email: "user@travel.local",
    role: UserRole.User,
  },
] as const;

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

    for (const user of SEED_USERS) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: { role: user.role, isEmailVerified: true },
        create: {
          ...user,
          passwordHash,
          isEmailVerified: true,
          clientProfile: { create: {} },
        },
      });
    }

    console.log(`Seeded ${SEED_USERS.length} users (password: ${SEED_PASSWORD})`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
