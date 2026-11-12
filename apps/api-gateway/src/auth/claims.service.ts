import { createHash } from "node:crypto";
import { HttpService } from "@nestjs/axios";
import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { isAxiosError } from "axios";
import type Redis from "ioredis";
import { firstValueFrom } from "rxjs";
import { type UserIdentityDto } from "@app/contracts";
import { REDIS_CLIENT } from "../redis/redis.module";
import { SERVICE_URLS } from "../routing/routes";

export type Claims = Pick<UserIdentityDto, "id" | "role" | "isEmailVerified">;

type AccessTokenPayload = { sub: string; role: string; exp: number };

// v1 has no token: X-User-Id lookups are cached briefly (not in the spec, saves an auth-service call per request)
const V1_IDENTITY_TTL_SECONDS = 60;

/**
 * JWT validation happens ONLY here (spec: "Валидация JWT выполняется только на API Gateway").
 * The signature and expiry are checked locally on every request (cheap). The claims that can change
 * (role, isEmailVerified) come from auth-service once per token and are cached in Redis until the token
 * expires: repeated requests with the same token don't call auth-service (spec 3.1).
 */
@Injectable()
export class ClaimsService {
  private readonly logger = new Logger(ClaimsService.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly http: HttpService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    configService: ConfigService,
  ) {
    const { env, fallback } = SERVICE_URLS["auth-service"];
    this.authServiceUrl = configService.get<string>(env) ?? fallback;
  }

  async claimsForToken(token: string): Promise<Claims> {
    let payload: AccessTokenPayload;

    try {
      payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }

    // The token itself is a secret: the cache key is its hash
    const key = `jwt:claims:${createHash("sha256").update(token).digest("hex")}`;
    const cached = await this.cacheGet(key);

    if (cached) {
      return cached;
    }

    const identity = await this.fetchIdentity(payload.sub);

    if (!identity) {
      throw new UnauthorizedException("User no longer exists");
    }

    const claims = toClaims(identity);
    const ttl = payload.exp - Math.floor(Date.now() / 1000); // TTL = remaining life of the access token
    await this.cacheSet(key, claims, ttl);

    return claims;
  }

  // v1: the client sends X-User-Id (stage I contract). null = no such user.
  async claimsForUserId(userId: string): Promise<Claims | null> {
    const key = `v1:identity:${userId}`;
    const cached = await this.cacheGet(key);

    if (cached) {
      return cached;
    }

    const identity = await this.fetchIdentity(userId);

    if (!identity) {
      return null;
    }

    const claims = toClaims(identity);
    await this.cacheSet(key, claims, V1_IDENTITY_TTL_SECONDS);

    return claims;
  }

  private async fetchIdentity(userId: string): Promise<UserIdentityDto | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<UserIdentityDto>(`${this.authServiceUrl}/internal/v1/users/${userId}`),
      );
      return response.data;
    } catch (error) {
      // 404: unknown user; 400: not a UUID -> also "no such user"
      if (
        isAxiosError(error) &&
        (error.response?.status === 404 || error.response?.status === 400)
      ) {
        return null;
      }

      this.logger.error(`auth-service identity lookup failed: ${describe(error)}`);
      throw new ServiceUnavailableException("Auth service is unavailable");
    }
  }

  // Redis is an optimization: if it is down, fall back to auth-service instead of failing the request
  private async cacheGet(key: string): Promise<Claims | null> {
    try {
      const value = await this.redis.get(key);
      return value ? (JSON.parse(value) as Claims) : null;
    } catch (error) {
      this.logger.warn(`Redis GET failed, asking auth-service: ${describe(error)}`);
      return null;
    }
  }

  private async cacheSet(key: string, claims: Claims, ttlSeconds: number): Promise<void> {
    if (ttlSeconds <= 0) {
      return;
    }

    try {
      await this.redis.set(key, JSON.stringify(claims), "EX", ttlSeconds);
    } catch (error) {
      this.logger.warn(`Redis SET failed: ${describe(error)}`);
    }
  }
}

function toClaims(identity: UserIdentityDto): Claims {
  return { id: identity.id, role: identity.role, isEmailVerified: identity.isEmailVerified };
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message || error.name : String(error);
}
