import { faker } from "@faker-js/faker";
import { Currency } from "#prisma";
import { userMock } from "./user.mock";

export const clientProfileMock = {
  id: faker.string.uuid(),
  userId: userMock.id,
  firstName: null,
  lastName: null,
  phone: null,
  preferredCurrency: Currency.BYN,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};
