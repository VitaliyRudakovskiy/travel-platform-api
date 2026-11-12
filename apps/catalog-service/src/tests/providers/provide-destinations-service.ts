import { DestinationsService } from "../../modules/v1/destinations/destinations.service";
import { destinationsServiceMock } from "../mocks/destinations-service.mock";

export const provideDestinationsService = () => ({
  provide: DestinationsService,
  useValue: destinationsServiceMock,
});
