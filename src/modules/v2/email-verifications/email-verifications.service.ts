import { createHash, randomBytes } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@services/prisma.service";
import { NotificationChannel, NotificationStatus, NotificationType } from "#prisma";

@Injectable()
export class EmailVerificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async issue(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (user.isEmailVerified) {
      throw new ConflictException("Email is already verified");
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashVerificationToken(token);
    const expiresAt = verificationExpiresAt(
      this.configService.get<string>("EMAIL_VERIFICATION_EXPIRES_IN") ?? "24h",
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.emailVerification.deleteMany({
        where: { userId },
      });

      await tx.emailVerification.create({
        data: {
          userId,
          tokenHash,
          expiresAt,
        },
      });

      await tx.notification.create({
        data: {
          userId,
          type: NotificationType.email_verification,
          channel: NotificationChannel.email,
          status: NotificationStatus.pending,
          payload: { token },
        },
      });
    });
  }

  async confirm(token: string): Promise<void> {
    const verification = await this.prisma.emailVerification.findFirst({
      where: { tokenHash: hashVerificationToken(token) },
    });

    if (!verification) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    if (verification.expiresAt <= new Date()) {
      await this.prisma.emailVerification.delete({
        where: { id: verification.id },
      });
      throw new BadRequestException("Invalid or expired verification token");
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: verification.userId },
        data: { isEmailVerified: true },
      });

      await tx.emailVerification.deleteMany({
        where: { userId: verification.userId },
      });
    });
  }
}

function hashVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function verificationExpiresAt(expiresIn: string): Date {
  const match = /^(\d+)([smhd])$/.exec(expiresIn);

  if (!match) {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + value * multipliers[unit as keyof typeof multipliers]);
}
