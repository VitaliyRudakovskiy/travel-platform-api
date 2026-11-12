import { AuthClient } from "../../modules/auth-client/auth-client.service";
import { authClientMock } from "../mocks/auth-client.mock";

export const provideAuthClient = () => ({
  provide: AuthClient,
  useValue: authClientMock,
});
