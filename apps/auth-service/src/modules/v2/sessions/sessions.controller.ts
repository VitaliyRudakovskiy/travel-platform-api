import { SessionsService } from "../../v1/sessions/sessions.service";
import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import type { User } from "#auth-prisma";
import { AuthenticatedCredentials } from "../../v1/sessions/passport/authenticated-credentials.decorator";
import { LocalAuthGuard } from "../../v1/sessions/passport/local-auth.guard";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "@app/common";
import { LoginClass } from "../../v1/sessions/schemas/swagger/login-class";
import { type RefreshTokenDto, refreshTokenSchema } from "./schemas/refresh-token.schema";
import {
  type AccessTokenResponseDto,
  type TokenResponseDto,
} from "./schemas/token-response.schema";
import {
  AccessTokenResponse,
  RefreshTokenBody,
  TokenResponse,
} from "./schemas/swagger/token-response";

@ApiTags("Sessions")
@Controller({ path: "sessions", version: "2" })
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "User login",
    description: "Authenticates a user and returns access and refresh tokens",
  })
  @ApiBody({ type: LoginClass })
  @ApiResponse({
    status: 201,
    description: "Successfully authenticated, session created",
    type: TokenResponse,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials - user not found or wrong password",
  })
  async login(@AuthenticatedCredentials() user: User): Promise<TokenResponseDto> {
    return this.sessionsService.loginWithTokens(user);
  }

  @Post("refresh")
  @ApiOperation({
    summary: "Refresh access token",
    description: "Issues a new access token for a valid refresh token",
  })
  @ApiBody({ type: RefreshTokenBody })
  @ApiResponse({
    status: 201,
    description: "Access token refreshed",
    type: AccessTokenResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Refresh token is missing, expired, or revoked",
  })
  async refresh(
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto,
  ): Promise<AccessTokenResponseDto> {
    return this.sessionsService.refreshAccessToken(body.refreshToken);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Logout",
    description: "Deletes the refresh token from the server. Reusing it later returns 401.",
  })
  @ApiBody({ type: RefreshTokenBody })
  @ApiResponse({
    status: 204,
    description: "Logged out",
  })
  @ApiResponse({
    status: 401,
    description: "Refresh token is missing, expired, or already revoked",
  })
  async logout(
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: RefreshTokenDto,
  ): Promise<void> {
    return this.sessionsService.logout(body.refreshToken);
  }
}
