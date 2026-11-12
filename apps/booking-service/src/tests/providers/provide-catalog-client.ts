import { CatalogClient } from "../../modules/catalog-client/catalog-client.service";
import { catalogClientMock } from "../mocks/catalog-client.mock";

export const provideCatalogClient = () => ({
  provide: CatalogClient,
  useValue: catalogClientMock,
});
