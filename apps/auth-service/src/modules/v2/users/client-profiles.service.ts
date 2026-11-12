import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { type ProfileResponseDto } from "./schemas/profile-response.schema";
import { type UpdateProfileDto } from "./schemas/update-profile.schema";

@Injectable()
export class ClientProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    return this.toResponse(profile);
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    const updatedProfile = await this.prisma.clientProfile.update({
      where: { userId },
      data: updateProfileDto,
    });

    return this.toResponse(updatedProfile);
  }

  private toResponse(profile: {
    id: string;
    userId: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    preferredCurrency: ProfileResponseDto["preferredCurrency"];
    createdAt: Date;
    updatedAt: Date;
  }): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      preferredCurrency: profile.preferredCurrency,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
