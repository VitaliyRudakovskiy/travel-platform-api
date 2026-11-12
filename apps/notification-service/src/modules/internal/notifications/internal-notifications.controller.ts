import { Body, Controller, HttpCode, HttpStatus, Post, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { ZodValidationPipe } from "@app/common";
import {
  type EmailVerificationNotificationDto,
  emailVerificationNotificationSchema,
} from "@app/contracts";
import { NotificationsService } from "../../v2/notifications/notifications.service";

// Service-to-service API (called by auth-service), reachable only inside the Docker network.
@ApiExcludeController()
@Controller({ path: "internal/v1/notifications", version: VERSION_NEUTRAL })
export class InternalNotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // 202: the email is queued (pending) and sent by the worker, not inside this request
  @Post("email-verification")
  @HttpCode(HttpStatus.ACCEPTED)
  async emailVerification(
    @Body(new ZodValidationPipe(emailVerificationNotificationSchema))
    body: EmailVerificationNotificationDto,
  ): Promise<void> {
    await this.notificationsService.createEmailVerification(body);
  }
}
