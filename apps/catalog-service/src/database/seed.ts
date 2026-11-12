// Dev/test catalog data: `pnpm seed:catalog` (idempotent: upserts by fixed ids, resets reserved capacity).
// Offers belong to the `agent` user of the auth-service seed (apps/auth-service/prisma/seed.ts).
import { type DeepPartial } from "typeorm";
import dataSource from "./data-source";
import { DestinationEntity } from "../modules/v1/destinations/entities/destination.entity";
import { OfferEntity } from "../modules/v1/offers/entities/offer.entity";
import { Currency, OfferStatus, OfferType } from "../modules/v1/offers/models/offer.enums";

const AGENT_ID = "00000000-0000-4000-8000-000000000002";

const DESTINATIONS: DeepPartial<DestinationEntity>[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Minsk",
    countryCode: "BY",
    description: "Capital of Belarus",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    name: "Warsaw",
    countryCode: "PL",
    description: "Capital of Poland",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    name: "Paris",
    countryCode: "FR",
    description: null,
  },
];

const common = {
  ownerId: AGENT_ID,
  reservedCapacity: 0,
  status: OfferStatus.active,
  availableFrom: new Date("2026-01-01T00:00:00.000Z"),
  availableTo: new Date("2027-12-31T00:00:00.000Z"),
  stars: null,
  address: null,
  flightNumber: null,
  airline: null,
  durationDays: null,
  includesMeals: null,
};

const OFFERS: DeepPartial<OfferEntity>[] = [
  {
    ...common,
    id: "20000000-0000-4000-8000-000000000001",
    type: OfferType.hotel,
    destinationId: DESTINATIONS[0].id,
    title: "Hotel Minsk Center",
    description: "Hotel in the city center",
    price: 120,
    currency: Currency.BYN,
    maxGuests: 3,
    maxConcurrentBookings: 5,
    stars: 4,
    address: "Nezavisimosti Ave 11",
  },
  {
    ...common,
    id: "20000000-0000-4000-8000-000000000002",
    type: OfferType.flight,
    destinationId: DESTINATIONS[1].id,
    title: "Minsk - Warsaw flight",
    description: null,
    price: 89.99,
    currency: Currency.EUR,
    maxGuests: 1,
    maxConcurrentBookings: 20,
    flightNumber: "LO7952",
    airline: "LOT",
  },
  {
    // maxConcurrentBookings = 1: the second reservation gets 409 (capacity checks)
    ...common,
    id: "20000000-0000-4000-8000-000000000003",
    type: OfferType.tour,
    destinationId: DESTINATIONS[2].id,
    title: "Weekend in Paris (single slot)",
    description: "Guided tour, one group at a time",
    price: 450,
    currency: Currency.EUR,
    maxGuests: 2,
    maxConcurrentBookings: 1,
    durationDays: 3,
    includesMeals: true,
  },
];

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    await dataSource.getRepository(DestinationEntity).upsert(DESTINATIONS, ["id"]);
    await dataSource.getRepository(OfferEntity).upsert(OFFERS, ["id"]);

    console.log(`Seeded ${DESTINATIONS.length} destinations and ${OFFERS.length} offers`);
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
