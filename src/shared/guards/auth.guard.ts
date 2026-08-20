import { UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers["x-user-id"];

    if (!userId) {
      throw new UnauthorizedException("X-User-Id header is required");
    }

    const user: UserResponseDto | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    request.user = user;
    return true;
  }
}
