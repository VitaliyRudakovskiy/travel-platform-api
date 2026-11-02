import { type LoginDto, loginSchema } from "@modules/v1/users/schemas/login.schema";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { SessionsService } from "@modules/v1/sessions/sessions.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SessionResponse } from "@modules/v1/sessions/schemas/swagger/session-response";
import { SessionResponseDto } from "@modules/v1/sessions/schemas/session-response.schema";
import { LoginClass } from "@modules/v1/sessions/schemas/swagger/login-class";

@ApiTags("Sessions")
@Controller({ path: "sessions", version: "2" })
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(loginSchema))
  @ApiOperation({
    summary: "User login",
    description: "Authenticates a user in the application",
  })
  @ApiBody({ type: LoginClass })
  @ApiResponse({
    status: 200,
    description: "Successfully authenticated",
    type: SessionResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials - user not found or wrong password",
  })
  async login(@Body() loginDto: LoginDto): Promise<SessionResponseDto> {
    return this.sessionsService.login(loginDto);
  }
}
