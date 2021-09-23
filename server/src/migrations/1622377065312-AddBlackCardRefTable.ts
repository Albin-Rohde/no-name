import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBlackCardRefTable1622377065312 implements MigrationInterface {
    name = 'AddBlackCardRefTable1622377065312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_be1056e043a367e95d57f3cccd2"`);
        await queryRunner.query(`CREATE TYPE "black_card_ref_state_enum" AS ENUM('active', 'used')`);
        await queryRunner.query(`CREATE TABLE "black_card_ref" ("id" SERIAL NOT NULL, "state" "black_card_ref_state_enum" NOT NULL DEFAULT 'active', "game_key" character varying NOT NULL, "black_card_id_fk" integer NOT NULL, CONSTRAINT "PK_98049dcccc91aa6dd46defde88e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "black_card_ref" ADD CONSTRAINT "FK_3d39a8830d82d580e422bcb739e" FOREIGN KEY ("black_card_id_fk") REFERENCES "black_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_be1056e043a367e95d57f3cccd2" FOREIGN KEY ("black_card_id_fk") REFERENCES "black_card_ref"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_be1056e043a367e95d57f3cccd2"`);
        await queryRunner.query(`ALTER TABLE "black_card_ref" DROP CONSTRAINT "FK_3d39a8830d82d580e422bcb739e"`);
        await queryRunner.query(`DROP TABLE "black_card_ref"`);
        await queryRunner.query(`DROP TYPE "black_card_ref_state_enum"`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_be1056e043a367e95d57f3cccd2" FOREIGN KEY ("black_card_id_fk") REFERENCES "black_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
