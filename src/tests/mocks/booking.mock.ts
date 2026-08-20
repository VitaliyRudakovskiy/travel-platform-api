import { faker } from "@faker-js/faker";
import { destinationMock } from "./destination.mock";

export const bookingMock = {
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  startDate: faker.date.recent(),
  endDate: faker.date.future(),
  guestsCount: faker.number.int({ min: 1, max: 4 }),
  totalPrice: { toNumber: () => 300.5 },
  status: "draft",
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  offer: {
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    type: "hotel",
    price: { toNumber: () => 150.5 },
    currency: "USD",
    destination: {
      id: destinationMock.id,
      name: destinationMock.name,
      countryCode: destinationMock.countryCode,
    },
  },
};
