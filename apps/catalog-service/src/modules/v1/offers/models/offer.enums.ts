// catalog-service has no Prisma client: the enums of the monolith's offer.prisma become const objects.
// Same call-site syntax (`OfferType.hotel`), and Object.values() feeds both TypeORM columns and Zod.
export const OfferType = {
  hotel: "hotel",
  flight: "flight",
  tour: "tour",
} as const;
export type OfferType = (typeof OfferType)[keyof typeof OfferType];

export const OfferStatus = {
  active: "active",
  archived: "archived",
} as const;
export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

export const Currency = {
  BYN: "BYN",
  USD: "USD",
  EUR: "EUR",
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];
