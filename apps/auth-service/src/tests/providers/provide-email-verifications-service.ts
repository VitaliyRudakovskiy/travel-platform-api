import { EmailVerificationsService } from "../../modules/v2/email-verifications/email-verifications.service";
import { emailVerificationsServiceMock } from "../mocks/email-verifications-service.mock";

export const provideEmailVerificationsService = () => ({
  provide: EmailVerificationsService,
  useValue: emailVerificationsServiceMock,
});
