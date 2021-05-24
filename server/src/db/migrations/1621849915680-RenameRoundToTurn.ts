import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameRoundToTurn1621849915680 implements MigrationInterface {
    name = 'RenameRoundToTurn1621849915680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_67caa6977086f2120a3f1acd4b6"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "current_round_number"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_67caa6977086f2120a3f1acd4b6"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "game_round_fk"`);
        await queryRunner.query(`DROP TABLE "game_round"`);
        await queryRunner.query(`CREATE TABLE "game_turn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "game_key_fk" uuid NOT NULL, "turn_number" integer NOT NULL, "card_wizz_user_id_fk" integer, CONSTRAINT "PK_1b44d0795ba2e4a6aa771ab8d01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "game_key_idx" ON "game_turn" ("game_key_fk") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_586b4565f20a388cd60a4e43fa" ON "game_turn" ("game_key_fk", "turn_number") `);
        await queryRunner.query(`ALTER TABLE "game" ADD "current_turn_number" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "game" ADD "game_turn_fk" uuid`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_221ef9e18f9248722f08003aaa1" UNIQUE ("game_turn_fk")`);
        await queryRunner.query(`ALTER TABLE "game_turn" ADD CONSTRAINT "FK_4f175e2d315c0089c6ef130b734" FOREIGN KEY ("card_wizz_user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_221ef9e18f9248722f08003aaa1" FOREIGN KEY ("game_turn_fk") REFERENCES "game_turn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_221ef9e18f9248722f08003aaa1"`);
        await queryRunner.query(`ALTER TABLE "game_turn" DROP CONSTRAINT "FK_4f175e2d315c0089c6ef130b734"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_221ef9e18f9248722f08003aaa1"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "game_turn_fk"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "current_turn_number"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "game_round_fk" uuid`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_67caa6977086f2120a3f1acd4b6" UNIQUE ("game_round_fk")`);
        await queryRunner.query(`ALTER TABLE "game" ADD "current_round_number" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`DROP INDEX "IDX_586b4565f20a388cd60a4e43fa"`);
        await queryRunner.query(`DROP INDEX "game_key_idx"`);
        await queryRunner.query(`DROP TABLE "game_turn"`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_67caa6977086f2120a3f1acd4b6" FOREIGN KEY ("game_round_fk") REFERENCES "game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
