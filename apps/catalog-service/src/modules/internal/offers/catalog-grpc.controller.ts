import { Controller } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { status } from "@grpc/grpc-js";
import {
  CATALOG_SERVICE_NAME,
  type GetOfferRequest,
  type GetOffersByIdsRequest,
  type ListOfferIdsByOwnerRequest,
  type OfferIds,
  type OfferInfo,
  type OffersInfo,
} from "@app/contracts";
import { InternalOffersService } from "./internal-offers.service";

// gRPC side of the hybrid app (port 50052): read access to offers for booking-service.
// An RpcException with a gRPC status code is what the client receives as an error.
@Controller()
export class CatalogGrpcController {
  constructor(private readonly internalOffersService: InternalOffersService) {}

  @GrpcMethod(CATALOG_SERVICE_NAME, "GetOffer")
  async getOffer({ id }: GetOfferRequest): Promise<OfferInfo> {
    const offer = await this.internalOffersService.getOffer(id);

    if (!offer) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Offer with id ${id} not found`,
      });
    }

    return offer;
  }

  @GrpcMethod(CATALOG_SERVICE_NAME, "GetOffersByIds")
  async getOffersByIds({ ids }: GetOffersByIdsRequest): Promise<OffersInfo> {
    return {
      offers: await this.internalOffersService.getOffersByIds(ids ?? []),
    };
  }

  @GrpcMethod(CATALOG_SERVICE_NAME, "ListOfferIdsByOwner")
  async listOfferIdsByOwner({ ownerId }: ListOfferIdsByOwnerRequest): Promise<OfferIds> {
    return {
      ids: await this.internalOffersService.listOfferIdsByOwner(ownerId),
    };
  }
}
