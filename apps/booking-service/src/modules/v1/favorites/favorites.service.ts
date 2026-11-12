import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { type Favorite, Prisma } from "#booking-prisma";
import { PrismaService } from "../../../prisma/prisma.service";
import { CatalogClient } from "../../catalog-client/catalog-client.service";
import { type OfferSummary, toOfferSummary } from "../../offer-summary/offer-summary";
import { FavoritesResponseDto } from "./schemas/favorite-response.schema";
import { PaginatedFavoritesResponseDto } from "./schemas/paginated-favorite-response.schema";
import { FavoriteQueryDto } from "./schemas/favorite-query.schema";

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogClient,
  ) {}

  async getAll(userId: string, query: FavoriteQueryDto): Promise<PaginatedFavoritesResponseDto> {
    const { page, limit } = query;

    const [total, favorites] = await Promise.all([
      this.prisma.favorite.count({ where: { userId } }),
      this.prisma.favorite.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const offers = await this.offerSummaries(favorites.map((favorite) => favorite.offerId));
    const totalPages = Math.ceil(total / limit);

    return {
      data: favorites.map((favorite) => this.toResponse(favorite, offers.get(favorite.offerId))),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async addToFavorites(offerId: string, userId: string): Promise<FavoritesResponseDto> {
    // The offer lives in catalog_db: check it over gRPC (stage II used a foreign key + a lookup)
    const offer = await this.catalog.getOffer(offerId).catch((error: unknown) => {
      throw error instanceof NotFoundException
        ? new NotFoundException(`Offer with id ${offerId} not found`)
        : error;
    });

    if (offer.deleted) {
      throw new NotFoundException(`Offer with id ${offerId} not found`);
    }

    try {
      const favorite = await this.prisma.favorite.create({ data: { userId, offerId } });

      return this.toResponse(favorite, toOfferSummary(offer));
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as Prisma.PrismaClientKnownRequestError).code === "P2002"
      ) {
        throw new ConflictException(`Offer with id ${offerId} is already in favorites`);
      }
      throw error;
    }
  }

  async removeFromFavorites(offerId: string, userId: string): Promise<void> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_offerId: { userId, offerId } },
    });

    if (!favorite) {
      throw new NotFoundException(`Offer with id ${offerId} is not in favorites`);
    }

    await this.prisma.favorite.delete({ where: { id: favorite.id } });
  }

  async isFavorite(offerId: string, userId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_offerId: { userId, offerId } },
    });

    return !!favorite;
  }

  // Embedded `offer` is optional in the contract: if catalog-service is down, return favorites without it.
  private async offerSummaries(offerIds: string[]): Promise<Map<string, OfferSummary>> {
    try {
      const offers = await this.catalog.getOffersByIds(offerIds);
      return new Map([...offers].map(([id, offer]) => [id, toOfferSummary(offer)]));
    } catch (error) {
      this.logger.warn(
        `Favorites returned without offer details: ${error instanceof Error ? error.message : String(error)}`,
      );
      return new Map();
    }
  }

  private toResponse(favorite: Favorite, offer: OfferSummary | undefined): FavoritesResponseDto {
    return {
      id: favorite.id,
      userId: favorite.userId,
      offerId: favorite.offerId,
      createdAt: favorite.createdAt,
      ...(offer ? { offer } : {}),
    };
  }
}
