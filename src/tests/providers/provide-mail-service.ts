import { MailService } from "@modules/v2/notifications/mail.service";
import { mailServiceMock } from "@tests/mocks/mail-service.mock";

export const provideMailService = () => ({
  provide: MailService,
  useValue: mailServiceMock,
});
