import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { EmailVerificationsService } from "./email-verifications.service";
import { confirmEmailSchema, type ConfirmEmailDto } from "./schemas/confirm-email.schema";
import { ConfirmEmail } from "./schemas/swagger/confirm-email";

@ApiTags("Email verifications")
@Controller({ path: "email-verifications", version: "2" })
export class EmailVerificationsController {
  constructor(private readonly emailVerificationsService: EmailVerificationsService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Confirm email",
    description: "Confirms the user's email with the token from the verification notification.",
  })
  @ApiBody({ type: ConfirmEmail })
  @ApiResponse({
    status: 204,
    description: "Email confirmed",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or expired verification token",
  })
  async confirm(
    @Body(new ZodValidationPipe(confirmEmailSchema)) body: ConfirmEmailDto,
  ): Promise<void> {
    return this.emailVerificationsService.confirm(body.token);
  }
}
