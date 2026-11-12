import { type INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../../app.module";
import { configureApp } from "@app/common";
import { MailService } from "@modules/v2/notifications/mail.service";
import { NotificationsWorker } from "@modules/v2/notifications/notifications.worker";
import { mailServiceMock } from "@tests/mocks/mail-service.mock";

// Boots the real AppModule against the test database. External side effects are replaced:
// - MailService: no SMTP in tests;
// - NotificationsWorker: a stub without @Interval, so background runs can't change
//   notification statuses in the middle of an assertion.
export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(MailService)
    .useValue(mailServiceMock)
    .overrideProvider(NotificationsWorker)
    .useValue({})
    .compile();

  const app = moduleRef.createNestApplication({ logger: false });
  configureApp(app);
  await app.init();

  return app;
}
