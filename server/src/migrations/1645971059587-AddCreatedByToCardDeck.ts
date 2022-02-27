import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreatedByToCardDeck1645971059587 implements MigrationInterface {
    name = 'AddCreatedByToCardDeck1645971059587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "public"."player" (email, username, password) VALUES('admin@fasoner.party', 'admin', 'noop')`)
        await queryRunner.query(`ALTER TABLE "public"."card_deck" ADD "public" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" ADD "owner_user_fk" integer`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" ADD CONSTRAINT "FK_4587914ab9fc33c26502214d05d" FOREIGN KEY ("owner_user_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE "public"."card_deck" SET "owner_user_fk" = 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."card_deck" DROP CONSTRAINT "FK_4587914ab9fc33c26502214d05d"`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" DROP COLUMN "owner_user_fk"`);
        await queryRunner.query(`ALTER TABLE "public"."card_deck" DROP COLUMN "public"`);
    }

}
