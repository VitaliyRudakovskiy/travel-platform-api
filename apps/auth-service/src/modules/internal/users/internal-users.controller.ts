import { Controller, Get, Param, ParseUUIDPipe, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { UsersService } from "../../v1/users/users.service";
import { type UserIdentityDto } from "./schemas/user-identity.schema";

// Service-to-service endpoint: not routed by the API Gateway, so it is hidden from the public Swagger.
// VERSION_NEUTRAL keeps the path as is; otherwise URI versioning would prefix it with /api/v1.
@ApiExcludeController()
@Controller({ path: "internal/v1/users", version: VERSION_NEUTRAL })
export class InternalUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  async getIdentity(
    @Param("userId", new ParseUUIDPipe()) userId: string,
  ): Promise<UserIdentityDto> {
    return this.usersService.getIdentity(userId);
  }
}
