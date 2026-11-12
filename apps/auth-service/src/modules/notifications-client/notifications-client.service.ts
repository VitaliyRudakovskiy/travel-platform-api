import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

export type EmailVerificationNotification = {
  userId: string;
  email: string;
  token: string;
};

// HTTP client of notification-service internal API (/internal/v1, reachable only inside the Docker network).
// Base URL and the 5 s timeout (spec 4.3) are configured in NotificationsClientModule.
@Injectable()
export class NotificationsClient {
  constructor(private readonly http: HttpService) {}

  async sendEmailVerification(notification: EmailVerificationNotification): Promise<void> {
    await firstValueFrom(
      this.http.post("/internal/v1/notifications/email-verification", notification),
    );
  }
}
