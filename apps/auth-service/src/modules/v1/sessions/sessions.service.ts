import { createHash, randomBytes } from "node:crypto";
import { LoginDto } from "../users/schemas/login.schema";
import {
  AccessTokenResponseDto,
  TokenResponseDto,
} from "../../v2/sessions/schemas/token-response.schema";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { type User } from "#auth-prisma";
import { PrismaService } from "../../../prisma/prisma.service";
import { SessionResponseDto } from "./schemas/session-response.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // `user` is already authenticated by LocalStrategy (passport-local) through validateCredentials().
  login(user: User): SessionResponseDto {
    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async loginWithTokens(user: User): Promise<TokenResponseDto> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });
    const refreshToken = randomBytes(32).toString("hex");

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashRefreshToken(refreshToken),
        expiresAt: refreshExpiresAt(
          this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d",
        ),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<AccessTokenResponseDto> {
    const session = await this.findValidSession(refreshToken);
    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const session = await this.findValidSession(refreshToken);

    await this.prisma.userSession.delete({
      where: { id: session.id },
    });
  }

  async validateCredentials(loginDto: LoginDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  private async findValidSession(refreshToken: string) {
    const session = await this.prisma.userSession.findUnique({
      where: {
        refreshTokenHash: hashRefreshToken(refreshToken),
      },
    });

    if (!session) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (session.expiresAt <= new Date()) {
      await this.prisma.userSession.delete({
        where: { id: session.id },
      });
      throw new UnauthorizedException("Invalid refresh token");
    }

    return session;
  }
}

function hashRefreshToken(refreshToken: string): string {
  return createHash("sha256").update(refreshToken).digest("hex");
}

function refreshExpiresAt(expiresIn: string): Date {
  const match = /^(\d+)([smhd])$/.exec(expiresIn);

  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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
