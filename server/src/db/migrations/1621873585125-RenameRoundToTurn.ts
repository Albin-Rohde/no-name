import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameRoundToTurn1621873585125 implements MigrationInterface {
    name = 'RenameRoundToTurn1621873585125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_fa4ab926bd2ea753958fa56373a"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "REL_fa4ab926bd2ea753958fa56373"`);
        await queryRunner.query(`ALTER TABLE "game_round" DROP CONSTRAINT "PK_d1d2e62e56e43c9d3a576d30a54"`);
        await queryRunner.query(`ALTER TABLE "game_round" DROP CONSTRAINT "FK_08b1bf55a1bbb892c0fdb27d585"`);
        await queryRunner.query(`DROP TABLE "game_round"`);
        await queryRunner.query(`CREATE TABLE "game_turn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "game_key_fk" uuid NOT NULL, "turn_number" integer NOT NULL, "card_wizz_user_id_fk" integer, CONSTRAINT "PK_1b44d0795ba2e4a6aa771ab8d01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "game_key_idx" ON "game_turn" ("game_key_fk") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_586b4565f20a388cd60a4e43fa" ON "game_turn" ("game_key_fk", "turn_number") `);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "current_round"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "turn_number" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "game" ADD "current_turn_fk" uuid`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_0e920065f385bf8089d01463eb1" UNIQUE ("current_turn_fk")`);
        await queryRunner.query(`ALTER TABLE "game_turn" ADD CONSTRAINT "FK_4f175e2d315c0089c6ef130b734" FOREIGN KEY ("card_wizz_user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_0e920065f385bf8089d01463eb1" FOREIGN KEY ("current_turn_fk") REFERENCES "game_turn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_0e920065f385bf8089d01463eb1"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_0e920065f385bf8089d01463eb1"`);
        await queryRunner.query(`ALTER TABLE "game_turn" DROP CONSTRAINT "FK_4f175e2d315c0089c6ef130b734"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "current_turn_fk"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "turn_number"`);
        await queryRunner.query(`DROP TABLE "game_turn"`);
        await queryRunner.query(`CREATE TABLE "game_round" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "game_key_fk" uuid NOT NULL, "round_number" integer NOT NULL, "card_wizz_user_id_fk" integer, CONSTRAINT "PK_d1d2e62e56e43c9d3a576d30a54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "game_key_idx" ON "game_round" ("game_key_fk") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c2154e87a486e734d9152bf16b" ON "game_round" ("game_key_fk", "round_number") `);
        await queryRunner.query(`ALTER TABLE "game" ADD "current_round" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "REL_fa4ab926bd2ea753958fa56373" UNIQUE ("key", "current_round")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_fa4ab926bd2ea753958fa56373a" FOREIGN KEY ("key", "current_round") REFERENCES "game_round"("game_key_fk","round_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_round" ADD CONSTRAINT "FK_08b1bf55a1bbb892c0fdb27d585" FOREIGN KEY ("card_wizz_user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
