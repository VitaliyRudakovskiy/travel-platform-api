import { type INestApplication } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { Currency, OfferType, UserRole } from "#prisma";
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

export type TestOffer = {
  id: string;
  ownerId: string;
  availableFrom: Date;
  availableTo: Date;
};

export async function createOffer(app: INestApplication, ownerId: string): Promise<TestOffer> {
  const prisma = getPrisma(app);
  const destination = await prisma.destination.create({
    data: { name: faker.location.city().slice(0, 50), countryCode: "FR" },
  });

  const offer = await prisma.offer.create({
    data: {
      type: OfferType.hotel,
      destinationId: destination.id,
      ownerId,
      title: "Integration test hotel",
      price: 100,
      currency: Currency.USD,
      maxGuests: 4,
      maxConcurrentBookings: 2,
      availableFrom: new Date("2026-01-01T00:00:00.000Z"),
      availableTo: new Date("2030-12-31T00:00:00.000Z"),
      stars: 4,
      address: "1 Test street",
    },
  });

  return {
    id: offer.id,
    ownerId: offer.ownerId,
    availableFrom: offer.availableFrom,
    availableTo: offer.availableTo,
  };
}
