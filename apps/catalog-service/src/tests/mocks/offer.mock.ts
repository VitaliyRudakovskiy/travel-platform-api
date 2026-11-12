import { faker } from "@faker-js/faker";
import { type OfferEntity } from "../../modules/v1/offers/entities/offer.entity";
import { Currency, OfferStatus, OfferType } from "../../modules/v1/offers/models/offer.enums";

export const offerMock: OfferEntity = {
  id: faker.string.uuid(),
  type: OfferType.hotel,
  destinationId: faker.string.uuid(),
  ownerId: faker.string.uuid(),
  title: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  price: 150.5,
  currency: Currency.USD,
  maxGuests: faker.number.int({ min: 1, max: 10 }),
  maxConcurrentBookings: 3,
  reservedCapacity: 1,
  availableFrom: new Date("2026-01-01T00:00:00.000Z"),
  availableTo: new Date("2027-12-31T00:00:00.000Z"),
  status: OfferStatus.active,
  stars: faker.number.int({ min: 1, max: 5 }),
  address: faker.location.streetAddress(),
  flightNumber: null,
  airline: null,
  durationDays: null,
  includesMeals: null,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
};
