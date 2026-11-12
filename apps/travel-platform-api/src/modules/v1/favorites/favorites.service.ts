import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { FavoritesResponseDto } from "./schemas/favorite-response.schema";
import { PaginatedFavoritesResponseDto } from "./schemas/paginated-favorite-response.schema";
import { FavoriteQueryDto } from "./schemas/favorite-query.schema";

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string, query: FavoriteQueryDto): Promise<PaginatedFavoritesResponseDto> {
    const { page, limit } = query;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const total = await this.prisma.favorite.count({
      where: { userId },
    });

    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        offer: {
          include: {
            destination: true,
            user: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });

    const data = favorites.map((favorite) => ({
      ...favorite,
      offer: {
        ...favorite.offer,
        price: favorite.offer.price.toNumber(),
        description: {
          ...favorite.offer.destination,
        },
        owner: {
          ...favorite.offer.user,
        },
      },
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async addToFavorites(offerId: string, userId: string): Promise<FavoritesResponseDto> {
    const existingOffer = await this.prisma.offer.findFirst({
      where: { id: offerId, deletedAt: null },
    });

    if (!existingOffer) {
      throw new NotFoundException(`Offer with id ${offerId} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    try {
      const favorite = await this.prisma.favorite.create({
        data: {
          userId,
          offerId,
        },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });

      const { offer, ...rest } = favorite;
      return {
        ...rest,
        offer: {
          ...offer,
          price: offer.price.toNumber(),
        },
      };
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException(`Offer with id ${offerId} is already in favorites`);
      }
      throw error;
    }
  }

  async removeFromFavorites(offerId: string, userId: string): Promise<void> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_offerId: {
          userId,
          offerId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException(`Offer with id ${offerId} is not in favorites`);
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }

  async isFavorite(offerId: string, userId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_offerId: {
          userId,
          offerId,
        },
      },
    });

    return !!favorite;
  }
}
