import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { type EmailVerificationNotificationDto } from "@app/contracts";

// HTTP client of notification-service internal API (/internal/v1, reachable only inside the Docker network).
// Base URL and the 5 s timeout (spec 4.3) are configured in NotificationsClientModule.
@Injectable()
export class NotificationsClient {
  constructor(private readonly http: HttpService) {}

  async sendEmailVerification(notification: EmailVerificationNotificationDto): Promise<void> {
    await firstValueFrom(
      this.http.post("/internal/v1/notifications/email-verification", notification),
    );
  }
}
