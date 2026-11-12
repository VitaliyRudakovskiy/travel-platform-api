import { Controller, Post, UseGuards, Version } from "@nestjs/common";
import type { User } from "#auth-prisma";
import { AuthenticatedCredentials } from "./passport/authenticated-credentials.decorator";
import { LocalAuthGuard } from "./passport/local-auth.guard";
import { SessionsService } from "./sessions.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SessionResponse } from "./schemas/swagger/session-response";
import type { SessionResponseDto } from "./schemas/session-response.schema";
import { LoginClass } from "./schemas/swagger/login-class";

@ApiTags("Sessions")
@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @Version("1")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "User login",
    description: "Authenticates a user in the application",
  })
  @ApiBody({ type: LoginClass })
  @ApiResponse({
    status: 201,
    description: "Successfully authenticated",
    type: SessionResponse,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials - user not found or wrong password",
  })
  login(@AuthenticatedCredentials() user: User): SessionResponseDto {
    return this.sessionsService.login(user);
  }
}
