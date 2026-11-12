import { OffersService } from "../../modules/v1/offers/offers.service";
import { offersServiceMock } from "../mocks/offers-service.mock";

export const provideOffersService = () => ({
  provide: OffersService,
  useValue: offersServiceMock,
});
