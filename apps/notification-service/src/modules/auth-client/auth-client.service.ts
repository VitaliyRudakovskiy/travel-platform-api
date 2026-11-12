import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";
import { type UserIdentityDto } from "@app/contracts";

// HTTP client of the auth-service internal API: the recipient's email is looked up when the email is sent,
// so notifications (which Agents can see) never store a customer's address.
@Injectable()
export class AuthClient {
  constructor(private readonly http: HttpService) {}

  async getUser(userId: string): Promise<UserIdentityDto> {
    try {
      const response = await firstValueFrom(
        this.http.get<UserIdentityDto>(`/internal/v1/users/${userId}`),
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException(`User ${userId} not found`);
      }

      throw new ServiceUnavailableException("Auth service is unavailable");
    }
  }
}
