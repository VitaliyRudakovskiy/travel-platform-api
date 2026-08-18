import { PartialType } from "@nestjs/swagger";
import { CreateOffer } from "./create-offer";

export class UpdateOffer extends PartialType(CreateOffer) {}
