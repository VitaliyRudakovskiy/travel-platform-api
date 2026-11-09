import { type INestApplication } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { UserRole } from "#prisma";
import { getPrisma } from "./database";

const BCRYPT_ROUNDS = 4;

type CreateUserOptions = {
  role?: UserRole;
  isEmailVerified?: boolean;
};

export type TestUser = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
};

export async function createUser(
  app: INestApplication,
  { role = UserRole.User, isEmailVerified = true }: CreateUserOptions = {},
): Promise<TestUser> {
  const password = "Password123!";
  const user = await getPrisma(app).user.create({
    data: {
      username: faker.internet.username().slice(0, 50),
      email: faker.internet.email().toLowerCase(),
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      role,
      isEmailVerified,
    },
  });

  return { id: user.id, email: user.email, password, role: user.role };
}
