import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIndex1644868651847 implements MigrationInterface {
    name = 'AddIndex1644868651847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."username_idx"`);
        await queryRunner.query(`CREATE INDEX "game_fk" ON "public"."player" ("game_fk") `);
        await queryRunner.query(`CREATE INDEX "white_card_id_fk" ON "public"."white_card_ref" ("white_card_id_fk") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff1a4ba9fd3c4a57fd50067c5a" ON "public"."white_card_ref" ("user_id_fk", "game_key") `);
        await queryRunner.query(`CREATE INDEX "game_key" ON "public"."white_card_ref" ("game_key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ff1a4ba9fd3c4a57fd50067c5a"`);
        await queryRunner.query(`DROP INDEX "public"."white_card_id_fk"`);
        await queryRunner.query(`DROP INDEX "public"."game_fk"`);
        await queryRunner.query(`CREATE INDEX "username_idx" ON "public"."player" ("username") `);
        await queryRunner.query(`DROP INDEX "public"."game_key"`);
    }

}
