import { faker } from "@faker-js/faker";

export const destinationMock = {
  id: faker.string.uuid(),
  name: faker.location.city(),
  countryCode: faker.string.alpha({ length: 2 }).toUpperCase(),
  description: faker.lorem.sentence(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};
