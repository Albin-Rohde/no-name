import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAndRemoveIndexWcCd1645822400588 implements MigrationInterface {
    name = 'AddAndRemoveIndexWcCd1645822400588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."game_fk"`);
        await queryRunner.query(`DROP INDEX "public"."white_card_id_fk"`);
        await queryRunner.query(`DROP INDEX "public"."game_key"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1868245e5e6ebfa9fb4430f5ac"`);
        await queryRunner.query(`CREATE INDEX "IDX_46393e0d6dc5b13e2b676fe0a7" ON "public"."player" ("game_fk") `);
        await queryRunner.query(`CREATE INDEX "IDX_adb7ad5c006d20a99bba00828a" ON "public"."white_card_ref" ("white_card_id_fk") `);
        await queryRunner.query(`CREATE INDEX "IDX_57bd885c39cd40c2ad13bf01e0" ON "public"."white_card_ref" ("game_key") `);
        await queryRunner.query(`CREATE INDEX "IDX_785292f892370246dcecc2c01b" ON "public"."white_card" ("deck_fk") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_785292f892370246dcecc2c01b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_57bd885c39cd40c2ad13bf01e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_adb7ad5c006d20a99bba00828a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46393e0d6dc5b13e2b676fe0a7"`);
        await queryRunner.query(`CREATE INDEX "IDX_1868245e5e6ebfa9fb4430f5ac" ON "public"."card_deck" ("name") `);
        await queryRunner.query(`CREATE INDEX "game_key" ON "public"."white_card_ref" ("game_key") `);
        await queryRunner.query(`CREATE INDEX "white_card_id_fk" ON "public"."white_card_ref" ("white_card_id_fk") `);
        await queryRunner.query(`CREATE INDEX "game_fk" ON "public"."player" ("game_fk") `);
    }

}
