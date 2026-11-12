import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCatalog1794486856170 implements MigrationInterface {
  name = "InitCatalog1794486856170";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."offer_type" AS ENUM('hotel', 'flight', 'tour')`);
    await queryRunner.query(`CREATE TYPE "public"."currency" AS ENUM('BYN', 'USD', 'EUR')`);
    await queryRunner.query(`CREATE TYPE "public"."offer_status" AS ENUM('active', 'archived')`);
    await queryRunner.query(
      `CREATE TABLE "offers" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "type" "public"."offer_type" NOT NULL, "destination_id" uuid NOT NULL, "owner_id" uuid NOT NULL, "title" character varying(100) NOT NULL, "description" text, "price" numeric(7,2) NOT NULL, "currency" "public"."currency" NOT NULL, "max_guests" integer NOT NULL DEFAULT '1', "max_concurrent_bookings" integer NOT NULL DEFAULT '1', "reserved_capacity" integer NOT NULL DEFAULT '0', "available_from" TIMESTAMP NOT NULL, "available_to" TIMESTAMP NOT NULL, "status" "public"."offer_status" NOT NULL DEFAULT 'active', "stars" integer, "address" character varying(100), "flight_number" character varying(25), "airline" character varying(100), "duration_days" integer, "includes_meals" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "CHK_offers_reserved_capacity" CHECK ("reserved_capacity" >= 0 AND "reserved_capacity" <= "max_concurrent_bookings"), CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_8101f7169d0e4bf3695de1c4eb" ON "offers" ("type") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_8f14b9cd6a42acbf4d795e3c27" ON "offers" ("destination_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1e2232f2458ed1b0bb6bdb6ba" ON "offers" ("owner_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_434239966cb60e2dbc6178f993" ON "offers" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39f73abdeb8182fe9fa7363c89" ON "offers" ("available_from", "available_to") `,
    );
    await queryRunner.query(
      `CREATE TABLE "destinations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(50) NOT NULL, "country_code" character varying(2) NOT NULL, "description" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69c5e8db964dcb83d3a0640f3c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b32fdaf5fa464fff063b9c4c4c" ON "destinations" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e23c8614cb9b103923e6ff5af" ON "destinations" ("country_code") `,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_8f14b9cd6a42acbf4d795e3c27e" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_8f14b9cd6a42acbf4d795e3c27e"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_3e23c8614cb9b103923e6ff5af"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b32fdaf5fa464fff063b9c4c4c"`);
    await queryRunner.query(`DROP TABLE "destinations"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_39f73abdeb8182fe9fa7363c89"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_434239966cb60e2dbc6178f993"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e1e2232f2458ed1b0bb6bdb6ba"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8f14b9cd6a42acbf4d795e3c27"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8101f7169d0e4bf3695de1c4eb"`);
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(`DROP TYPE "public"."offer_status"`);
    await queryRunner.query(`DROP TYPE "public"."currency"`);
    await queryRunner.query(`DROP TYPE "public"."offer_type"`);
  }
}
