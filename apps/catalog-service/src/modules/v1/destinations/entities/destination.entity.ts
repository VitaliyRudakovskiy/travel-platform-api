import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OfferEntity } from "../../offers/entities/offer.entity";

@Entity("destinations")
export class DestinationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ type: "varchar", length: 50 })
  name: string;

  @Index()
  @Column({ name: "country_code", type: "varchar", length: 2 })
  countryCode: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => OfferEntity, (offer) => offer.destination)
  offers: OfferEntity[];
}
