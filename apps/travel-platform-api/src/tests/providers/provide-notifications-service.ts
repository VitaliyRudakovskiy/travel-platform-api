import { NotificationsService } from "@modules/v2/notifications/notifications.service";
import { notificationsServiceMock } from "@tests/mocks/notifications-service.mock";

export const provideNotificationsService = () => ({
  provide: NotificationsService,
  useValue: notificationsServiceMock,
});
