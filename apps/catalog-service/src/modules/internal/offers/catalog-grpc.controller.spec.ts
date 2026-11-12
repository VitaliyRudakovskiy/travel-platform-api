import { RpcException } from "@nestjs/microservices";
import { status } from "@grpc/grpc-js";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { type InternalOffersService } from "./internal-offers.service";
import { CatalogGrpcController } from "./catalog-grpc.controller";

describe("CatalogGrpcController", () => {
  const service = {
    getOffer: vi.fn(),
    getOffersByIds: vi.fn(),
    listOfferIdsByOwner: vi.fn(),
  };
  let controller: CatalogGrpcController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new CatalogGrpcController(service as unknown as InternalOffersService);
  });

  it("returns the offer", async () => {
    service.getOffer.mockResolvedValue({ id: "offer-1" });

    await expect(controller.getOffer({ id: "offer-1" })).resolves.toEqual({ id: "offer-1" });
  });

  it("answers NOT_FOUND for an unknown offer", async () => {
    service.getOffer.mockResolvedValue(null);

    const error = await controller.getOffer({ id: "missing" }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(RpcException);
    expect((error as RpcException).getError()).toEqual(
      expect.objectContaining({ code: status.NOT_FOUND }),
    );
  });

  it("treats a missing repeated field as an empty list", async () => {
    service.getOffersByIds.mockResolvedValue([]);

    // proto3 omits empty repeated fields on the wire, so `ids` may arrive undefined
    await expect(controller.getOffersByIds({} as never)).resolves.toEqual({ offers: [] });
    expect(service.getOffersByIds).toHaveBeenCalledWith([]);
  });

  it("wraps owner offer ids", async () => {
    service.listOfferIdsByOwner.mockResolvedValue(["a"]);

    await expect(controller.listOfferIdsByOwner({ ownerId: "owner" })).resolves.toEqual({
      ids: ["a"],
    });
  });
});
