import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import bcrypt from "bcrypt";
import { CreateUserDto } from "./schemas/create-user.schema";
import { UserResponseDto } from "./schemas/user-response.schema";
import { PrismaService } from "../../../prisma/prisma.service";
import { UpdateUserDto } from "./schemas/update-user.schema";
import { type UserIdentityDto } from "../../internal/users/schemas/user-identity.schema";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user) => this.toResponse(user));
  }

  async getById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toResponse(user);
  }

  // Identity for other services (internal API): role and verification flag, no credentials.
  async getIdentity(id: string): Promise<UserIdentityDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, isEmailVerified: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email or username already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        passwordHash,
      },
    });

    return this.toResponse(user);
  }

  async createWithProfile(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email or username already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
          passwordHash,
        },
      });

      await tx.clientProfile.create({
        data: {
          userId: createdUser.id,
        },
      });

      return createdUser;
    });

    return this.toResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException("Email is already taken");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.toResponse(updatedUser);
  }

  private toResponse(user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
