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
  Version,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import { type CreateUserDto, createUserSchema } from "./schemas/create-user.schema.js";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type UserResponseDto } from "./schemas/user-response.schema";
import { type UpdateUserDto, updateUserSchema } from "./schemas/update-user.schema";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserResponse } from "./schemas/swagger/user-response";
import { UpdateUser } from "./schemas/swagger/update-user";
import { CreateUser } from "./schemas/swagger/create-user";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Version("1")
  @ApiOperation({
    summary: "Get all users",
    description: "Returns a list of all registered users",
  })
  @ApiResponse({
    status: 200,
    description: "List of users",
    type: [UserResponse],
  })
  async get(): Promise<UserResponseDto[]> {
    return this.usersService.getAll();
  }

  @Get(":userId")
  @Version("1")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponse,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getOne(
    @Param("userId") userId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<UserResponseDto> {
    if (userId !== currentUser.id) {
      throw new ForbiddenException("You can only access your own profile");
    }

    return this.usersService.getById(userId);
  }

  @Post()
  @Version("1")
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
    return this.usersService.create(createUserDto);
  }

  @Patch(":userId")
  @Version("1")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Update user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBody({ type: UpdateUser })
  @ApiResponse({
    status: 200,
    description: "User updated",
    type: UserResponse,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 409, description: "Email is already taken" })
  async update(
    @Param("userId") userId: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<UserResponseDto> {
    if (userId !== currentUser.id) {
      throw new ForbiddenException("You can only update your own profile");
    }

    return this.usersService.update(userId, updateUserDto);
  }
}
