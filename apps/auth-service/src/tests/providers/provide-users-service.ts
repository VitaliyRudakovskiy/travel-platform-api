import { UsersService } from "../../modules/v1/users/users.service";
import { usersServiceMock } from "../mocks/users-service.mock";

export const provideUsersService = () => ({
  provide: UsersService,
  useValue: usersServiceMock,
});
