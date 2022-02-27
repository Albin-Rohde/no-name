import {MigrationInterface, QueryRunner} from "typeorm";

export class InviteColOnDeckRef1646084485631 implements MigrationInterface {
    name = 'InviteColOnDeckRef1646084485631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."card_deck_user_ref" ADD "invite" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."card_deck_user_ref" DROP COLUMN "invite"`);
    }

}
