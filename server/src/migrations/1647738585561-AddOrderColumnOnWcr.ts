import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrderColumnOnWcr1647738585561 implements MigrationInterface {
    name = 'AddOrderColumnOnWcr1647738585561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" ADD "order" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" DROP COLUMN "order"`);
    }

}
