import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { UsersService } from "@modules/v1/users/users.service";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { type CreateUserDto, createUserSchema } from "@modules/v1/users/schemas/create-user.schema";
import { UserRole } from "#prisma";
import { type AuthenticatedUser } from "@shared/auth/authenticated-user";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { RolesGuard } from "@shared/guards/roles.guard";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { Roles } from "@shared/decorators/roles.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { type UpdateUserDto, updateUserSchema } from "@modules/v1/users/schemas/update-user.schema";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserResponse } from "@modules/v1/users/schemas/swagger/user-response";
import { UpdateUser } from "@modules/v1/users/schemas/swagger/update-user";
import { CreateUser } from "@modules/v1/users/schemas/swagger/create-user";

@ApiTags("Users")
@Controller({ path: "users", version: "2" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all users",
    description: "Returns a list of all registered users. Admin only.",
  })
  @ApiResponse({
    status: 200,
    description: "List of users",
    type: [UserResponse],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin role required" })
  async get(): Promise<UserResponseDto[]> {
    return this.usersService.getAll();
  }

  @Get(":userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get user by ID",
    description:
      "Returns a user profile. Users can only access their own profile. Admins can access any profile.",
  })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponse,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getOne(
    @Param("userId") userId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    if (currentUser.role !== UserRole.Admin && userId !== currentUser.id) {
      throw new ForbiddenException("You can only access your own profile");
    }

    return this.usersService.getById(userId);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateUser })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.createWithProfile(createUserDto);
  }

  @Patch(":userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update user",
    description:
      "Updates a user profile. Users can only update their own profile. Admins can update any profile.",
  })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBody({ type: UpdateUser })
  @ApiResponse({
    status: 200,
    description: "User updated",
    type: UserResponse,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 409, description: "Email is already taken" })
  async update(
    @Param("userId") userId: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    if (currentUser.role !== UserRole.Admin && userId !== currentUser.id) {
      throw new ForbiddenException("You can only update your own profile");
    }

    return this.usersService.update(userId, updateUserDto);
  }
}
