import {MigrationInterface, QueryRunner} from "typeorm";

export class SetCardDeckOwnerToNotNull1645971303691 implements MigrationInterface {
    name = 'SetCardDeckOwnerToNotNull1645971303691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."card_deck" DROP CONSTRAINT "FK_4587914ab9fc33c26502214d05d"`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" ALTER COLUMN "owner_user_fk" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" ADD CONSTRAINT "FK_4587914ab9fc33c26502214d05d" FOREIGN KEY ("owner_user_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."card_deck" DROP CONSTRAINT "FK_4587914ab9fc33c26502214d05d"`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" ALTER COLUMN "owner_user_fk" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" ADD CONSTRAINT "FK_4587914ab9fc33c26502214d05d" FOREIGN KEY ("owner_user_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
