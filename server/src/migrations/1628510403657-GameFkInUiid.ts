import {MigrationInterface, QueryRunner} from "typeorm";

export class GameFkInUiid1628510403657 implements MigrationInterface {
    name = 'GameFkInUiid1628510403657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "UQ_a2b2fc7a7bf06673f26df35cae6" UNIQUE ("id", "game_fk")`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" DROP CONSTRAINT "FK_c81211623ae6ad27251a1e8da0a"`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" DROP COLUMN "game_key"`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" ADD "game_key" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" ADD CONSTRAINT "FK_ff1a4ba9fd3c4a57fd50067c5a6" FOREIGN KEY ("user_id_fk", "game_key") REFERENCES "player"("id","game_fk") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "UQ_a2b2fc7a7bf06673f26df35cae6"`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" DROP CONSTRAINT "FK_ff1a4ba9fd3c4a57fd50067c5a6"`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" DROP COLUMN "game_key"`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" ADD "game_key" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."white_card_ref" ADD CONSTRAINT "FK_c81211623ae6ad27251a1e8da0a" FOREIGN KEY ("user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
