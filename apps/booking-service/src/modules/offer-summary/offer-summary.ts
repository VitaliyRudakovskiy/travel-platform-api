import { type OfferInfo } from "@app/contracts";
import { type Currency, type OfferType } from "./offer.enums";

// The `offer` object embedded in booking / favorite responses (optional in the stage I/II contracts).
// Built from the catalog-service gRPC OfferInfo: the offer itself lives in catalog_db.
export type OfferSummary = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  currency: Currency;
  destination: {
    id: string;
    name: string;
    countryCode: string;
  };
};

export function toOfferSummary(offer: OfferInfo): OfferSummary {
  return {
    id: offer.id,
    title: offer.title,
    type: offer.type as OfferType,
    price: Number(offer.price),
    currency: offer.currency as Currency,
    destination: {
      id: offer.destinationId,
      name: offer.destinationName,
      countryCode: offer.destinationCountryCode,
    },
  };
}
