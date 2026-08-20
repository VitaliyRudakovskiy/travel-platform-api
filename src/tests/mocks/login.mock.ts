import { faker } from "@faker-js/faker";

export const loginMock = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};
