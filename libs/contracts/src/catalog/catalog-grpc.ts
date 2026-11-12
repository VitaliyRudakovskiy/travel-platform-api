import { join } from "node:path";
import { type Observable } from "rxjs";

// @grpc/proto-loader converts snake_case proto fields to camelCase (keepCase: false, the Nest default).
export const CATALOG_PACKAGE = "catalog";
export const CATALOG_SERVICE_NAME = "CatalogService";
// source: libs/contracts/src/catalog -> libs/contracts/proto; build: the proto is copied next to the compiled lib
export const CATALOG_PROTO_PATH = join(__dirname, "..", "..", "proto", "catalog.proto");

export type OfferInfo = {
  id: string;
  ownerId: string;
  title: string;
  type: string;
  price: string;
  currency: string;
  destinationId: string;
  destinationName: string;
  status: string;
  maxGuests: number;
  maxConcurrentBookings: number;
  availableFrom: string;
  availableTo: string;
  deleted: boolean;
};

export type GetOfferRequest = { id: string };
export type GetOffersByIdsRequest = { ids: string[] };
export type ListOfferIdsByOwnerRequest = { ownerId: string };
export type OffersInfo = { offers: OfferInfo[] };
export type OfferIds = { ids: string[] };

// Client side (booking-service): ClientGrpc.getService<CatalogGrpcClient>(CATALOG_SERVICE_NAME)
export interface CatalogGrpcClient {
  getOffer(request: GetOfferRequest): Observable<OfferInfo>;
  getOffersByIds(request: GetOffersByIdsRequest): Observable<OffersInfo>;
  listOfferIdsByOwner(request: ListOfferIdsByOwnerRequest): Observable<OfferIds>;
}
