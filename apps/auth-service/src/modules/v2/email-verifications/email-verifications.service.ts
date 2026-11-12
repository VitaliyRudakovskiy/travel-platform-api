import { createHash, randomBytes } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../../prisma/prisma.service";
import { NotificationsClient } from "../../notifications-client/notifications-client.service";

@Injectable()
export class EmailVerificationsService {
  private readonly logger = new Logger(EmailVerificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly notificationsClient: NotificationsClient,
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
    });

    // The email is sent by notification-service (stage III). The call happens after the commit and its failure
    // does not roll back the verification: the token is stored, and the user can ask to resend the email.
    try {
      await this.notificationsClient.sendEmailVerification({ userId, email: user.email, token });
    } catch (error) {
      this.logger.warn(
        `Verification email for user ${userId} was not handed to notification-service: ${errorMessage(error)}`,
      );
    }
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

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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
