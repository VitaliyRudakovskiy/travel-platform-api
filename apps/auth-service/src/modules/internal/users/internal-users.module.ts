import { Module } from "@nestjs/common";
import { UsersModule } from "../../v1/users/users.module";
import { InternalUsersController } from "./internal-users.controller";

@Module({
  imports: [UsersModule],
  controllers: [InternalUsersController],
})
export class InternalUsersModule {}
