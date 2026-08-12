import { LoginDto } from "@modules/users/schemas/login.schema";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { SessionResponseDto } from "./schemas/session-response.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto): Promise<SessionResponseDto> {
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

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
