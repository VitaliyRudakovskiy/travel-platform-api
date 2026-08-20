import { faker } from "@faker-js/faker";
import { loginMock } from "./login.mock";

export const userMock = {
  id: faker.string.uuid(),
  username: faker.internet.username(),
  email: loginMock.email,
  passwordHash: faker.string.alphanumeric(60),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};
