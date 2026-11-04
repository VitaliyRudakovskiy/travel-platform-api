import { ClientProfilesService } from "@modules/v2/users/client-profiles.service";
import { clientProfilesServiceMock } from "@tests/mocks/client-profiles-service.mock";

export const provideClientProfilesService = () => ({
  provide: ClientProfilesService,
  useValue: clientProfilesServiceMock,
});
