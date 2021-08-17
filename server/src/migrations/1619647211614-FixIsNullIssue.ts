import {MigrationInterface, QueryRunner} from "typeorm";

export class FixIsNullIssue1619647211614 implements MigrationInterface {
    name = 'FixIsNullIssue1619647211614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "black_card"."deck" IS NULL`);
        await queryRunner.query(`ALTER TABLE "black_card" ALTER COLUMN "deck" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "white_card"."deck" IS NULL`);
        await queryRunner.query(`ALTER TABLE "white_card" ALTER COLUMN "deck" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "white_card" ALTER COLUMN "deck" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "white_card"."deck" IS NULL`);
        await queryRunner.query(`ALTER TABLE "black_card" ALTER COLUMN "deck" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "black_card"."deck" IS NULL`);
    }

}
