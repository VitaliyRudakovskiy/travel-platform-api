import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DestinationEntity } from "../../destinations/entities/destination.entity";
import { Currency, OfferStatus, OfferType } from "../models/offer.enums";
import { decimalTransformer } from "./decimal.transformer";

// Reserved capacity can never go below zero or above the limit, even if two requests race:
// the database rejects such an UPDATE (stage III: capacity is managed by catalog-service).
@Check(
  "CHK_offers_reserved_capacity",
  `"reserved_capacity" >= 0 AND "reserved_capacity" <= "max_concurrent_bookings"`,
)
@Index(["availableFrom", "availableTo"])
@Entity("offers")
export class OfferEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ type: "enum", enum: Object.values(OfferType), enumName: "offer_type" })
  type: OfferType;

  @Index()
  @Column({ name: "destination_id", type: "uuid" })
  destinationId: string;

  @ManyToOne(() => DestinationEntity, (destination) => destination.offers, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "destination_id" })
  destination?: DestinationEntity;

  // Users live in auth_db (another service): a plain external id, no foreign key.
  @Index()
  @Column({ name: "owner_id", type: "uuid" })
  ownerId: string;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "numeric", precision: 7, scale: 2, transformer: decimalTransformer })
  price: number;

  @Column({ type: "enum", enum: Object.values(Currency), enumName: "currency" })
  currency: Currency;

  @Column({ name: "max_guests", type: "int", default: 1 })
  maxGuests: number;

  @Column({ name: "max_concurrent_bookings", type: "int", default: 1 })
  maxConcurrentBookings: number;

  // Slots currently reserved by booking-service (PATCH /internal/v1/offers/:id/capacity).
  @Column({ name: "reserved_capacity", type: "int", default: 0 })
  reservedCapacity: number;

  @Column({ name: "available_from", type: "timestamp" })
  availableFrom: Date;

  @Column({ name: "available_to", type: "timestamp" })
  availableTo: Date;

  @Index()
  @Column({
    type: "enum",
    enum: Object.values(OfferStatus),
    enumName: "offer_status",
    default: OfferStatus.active,
  })
  status: OfferStatus;

  @Column({ type: "int", nullable: true })
  stars: number | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  address: string | null;

  @Column({ name: "flight_number", type: "varchar", length: 25, nullable: true })
  flightNumber: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  airline: string | null;

  @Column({ name: "duration_days", type: "int", nullable: true })
  durationDays: number | null;

  @Column({ name: "includes_meals", type: "boolean", nullable: true })
  includesMeals: boolean | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  // Soft delete: repository.softDelete() fills it, find*() skips such rows automatically.
  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt: Date | null;
}
