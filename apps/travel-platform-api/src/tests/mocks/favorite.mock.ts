import { faker } from "@faker-js/faker";
import { destinationMock } from "./destination.mock";

export const favoriteMock = {
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  createdAt: faker.date.past(),
  offer: {
    id: faker.string.uuid(),
    type: "hotel",
    title: faker.lorem.words(3),
    price: { toNumber: () => 150.5 },
    currency: "USD",
    destination: {
      id: destinationMock.id,
      name: destinationMock.name,
      countryCode: destinationMock.countryCode,
    },
    user: {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      username: faker.internet.username(),
    },
  },
};
