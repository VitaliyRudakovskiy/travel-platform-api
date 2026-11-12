import { HttpService } from "@nestjs/axios";
import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  type OnModuleInit,
  ServiceUnavailableException,
} from "@nestjs/common";
import { type ClientGrpc } from "@nestjs/microservices";
import { status as GrpcStatus } from "@grpc/grpc-js";
import { isAxiosError } from "axios";
import { firstValueFrom, type Observable, timeout } from "rxjs";
import {
  type AvailabilityQueryDto,
  type AvailabilityResponseDto,
  type CapacityResponseDto,
  CATALOG_SERVICE_NAME,
  type CatalogGrpcClient,
  type OfferInfo,
} from "@app/contracts";

export const CATALOG_GRPC_CLIENT = "CATALOG_GRPC_CLIENT";
export const INTERNAL_CALL_TIMEOUT_MS = 5000;

/**
 * The only place in booking-service that talks to catalog-service:
 * - HTTP /internal/v1 for availability and capacity (spec 3.3 – 3.4);
 * - gRPC for reading offers (spec 4.2: gRPC between booking and catalog).
 * Errors become Nest HTTP exceptions: unreachable / timeout -> 503, not found -> 404, no capacity -> 409.
 */
@Injectable()
export class CatalogClient implements OnModuleInit {
  private readonly logger = new Logger(CatalogClient.name);
  private grpc: CatalogGrpcClient;

  constructor(
    private readonly http: HttpService,
    @Inject(CATALOG_GRPC_CLIENT) private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.grpc = this.grpcClient.getService<CatalogGrpcClient>(CATALOG_SERVICE_NAME);
  }

  // ---- gRPC: offers ----

  async getOffer(offerId: string): Promise<OfferInfo> {
    return this.callGrpc(this.grpc.getOffer({ id: offerId }), `offer ${offerId}`);
  }

  async getOffersByIds(offerIds: string[]): Promise<Map<string, OfferInfo>> {
    const uniqueIds = [...new Set(offerIds)];

    if (uniqueIds.length === 0) {
      return new Map();
    }

    const { offers } = await this.callGrpc(this.grpc.getOffersByIds({ ids: uniqueIds }), "offers");

    return new Map((offers ?? []).map((offer) => [offer.id, offer]));
  }

  // ---- HTTP: availability and capacity ----

  async checkAvailability(
    offerId: string,
    query: AvailabilityQueryDto,
  ): Promise<AvailabilityResponseDto> {
    return this.callHttp(() =>
      this.http.get<AvailabilityResponseDto>(`/internal/v1/offers/${offerId}/availability`, {
        params: query,
      }),
    );
  }

  async reserve(offerId: string): Promise<CapacityResponseDto> {
    return this.changeCapacity(offerId, 1);
  }

  async release(offerId: string): Promise<CapacityResponseDto> {
    return this.changeCapacity(offerId, -1);
  }

  private changeCapacity(offerId: string, reservedDelta: 1 | -1): Promise<CapacityResponseDto> {
    return this.callHttp(() =>
      this.http.patch<CapacityResponseDto>(`/internal/v1/offers/${offerId}/capacity`, {
        reservedDelta,
      }),
    );
  }

  private async callHttp<T>(request: () => Observable<{ data: T }>): Promise<T> {
    try {
      const response = await firstValueFrom(request());
      return response.data;
    } catch (error) {
      throw this.fromHttpError(error);
    }
  }

  private fromHttpError(error: unknown): HttpException {
    if (isAxiosError(error) && error.response) {
      const message = (error.response.data as { message?: string } | undefined)?.message;

      if (error.response.status === 404) {
        return new NotFoundException(message ?? "Offer not found");
      }

      if (error.response.status === 409) {
        return new ConflictException(message ?? "No available slots for this offer");
      }
    }

    // connection refused, DNS, timeout (ECONNABORTED) or an unexpected 5xx of catalog-service
    this.logger.error(`catalog-service HTTP call failed: ${describe(error)}`);
    return new ServiceUnavailableException("Catalog service is unavailable");
  }

  private async callGrpc<T>(call: Observable<T>, what: string): Promise<T> {
    try {
      return await firstValueFrom(call.pipe(timeout(INTERNAL_CALL_TIMEOUT_MS)));
    } catch (error) {
      if ((error as { code?: number }).code === GrpcStatus.NOT_FOUND) {
        throw new NotFoundException(`Catalog: ${what} not found`);
      }

      this.logger.error(`catalog-service gRPC call (${what}) failed: ${describe(error)}`);
      throw new ServiceUnavailableException("Catalog service is unavailable");
    }
  }
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
