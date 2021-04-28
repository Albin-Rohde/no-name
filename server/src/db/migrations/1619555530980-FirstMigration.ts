import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1619555530980 implements MigrationInterface {
    name = 'FirstMigration1619555530980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "black_card" ("id" SERIAL NOT NULL, "deck" character varying DEFAULT null, "text" character varying NOT NULL, CONSTRAINT "UQ_e072db27ec070353974390f8b39" UNIQUE ("text"), CONSTRAINT "PK_fb6e986af8db6449ccfcf8dc9d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_round" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "game_key_fk" uuid NOT NULL, "round_number" integer NOT NULL, "card_wizz_user_id_fk" integer, CONSTRAINT "PK_d1d2e62e56e43c9d3a576d30a54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "game_key_idx" ON "game_round" ("game_key_fk") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c2154e87a486e734d9152bf16b" ON "game_round" ("game_key_fk", "round_number") `);
        await queryRunner.query(`CREATE TABLE "game" ("key" uuid NOT NULL DEFAULT uuid_generate_v4(), "play_cards" integer NOT NULL, "rounds" integer NOT NULL, "card_deck" character varying NOT NULL, "private_lobby" boolean NOT NULL, "player_limit" integer NOT NULL, "started" boolean NOT NULL DEFAULT false, "current_round" integer NOT NULL DEFAULT '1', "host_user_id_fk" integer NOT NULL, "black_card_id_fk" integer, CONSTRAINT "REL_fa4ab926bd2ea753958fa56373" UNIQUE ("key", "current_round"), CONSTRAINT "PK_58e154d3e982a8e9400aac6c59f" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, "game_fk" uuid, "has_played" boolean NOT NULL DEFAULT false, "score" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8" UNIQUE ("username"), CONSTRAINT "UQ_19b3d69e0f058936531e3965b77" UNIQUE ("email"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "username_idx" ON "player" ("username") `);
        await queryRunner.query(`CREATE TYPE "white_card_ref_state_enum" AS ENUM('hand', 'played_hidden', 'played_show', 'winner', 'used')`);
        await queryRunner.query(`CREATE TABLE "white_card_ref" ("id" SERIAL NOT NULL, "state" "white_card_ref_state_enum" NOT NULL DEFAULT 'hand', "game_key" character varying NOT NULL, "white_card_id_fk" integer NOT NULL, "user_id_fk" integer NOT NULL, CONSTRAINT "PK_0a57769febc08a356073084b306" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "white_card" ("id" SERIAL NOT NULL, "deck" character varying DEFAULT null, "text" character varying NOT NULL, CONSTRAINT "UQ_9c4c340371e71ab2de609423bfc" UNIQUE ("text"), CONSTRAINT "PK_23792b20cc98f8dd8e0d2130e81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game_round" ADD CONSTRAINT "FK_08b1bf55a1bbb892c0fdb27d585" FOREIGN KEY ("card_wizz_user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_fa4ab926bd2ea753958fa56373a" FOREIGN KEY ("key", "current_round") REFERENCES "game_round"("game_key_fk","round_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_be1056e043a367e95d57f3cccd2" FOREIGN KEY ("black_card_id_fk") REFERENCES "black_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71" FOREIGN KEY ("game_fk") REFERENCES "game"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "white_card_ref" ADD CONSTRAINT "FK_adb7ad5c006d20a99bba00828a0" FOREIGN KEY ("white_card_id_fk") REFERENCES "white_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "white_card_ref" ADD CONSTRAINT "FK_c81211623ae6ad27251a1e8da0a" FOREIGN KEY ("user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "black_card"."deck" IS NULL`);
        await queryRunner.query(`ALTER TABLE "black_card" ALTER COLUMN "deck" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "white_card"."deck" IS NULL`);
        await queryRunner.query(`ALTER TABLE "white_card" ALTER COLUMN "deck" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "white_card_ref" DROP CONSTRAINT "FK_c81211623ae6ad27251a1e8da0a"`);
        await queryRunner.query(`ALTER TABLE "white_card_ref" DROP CONSTRAINT "FK_adb7ad5c006d20a99bba00828a0"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_be1056e043a367e95d57f3cccd2"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_fa4ab926bd2ea753958fa56373a"`);
        await queryRunner.query(`ALTER TABLE "game_round" DROP CONSTRAINT "FK_08b1bf55a1bbb892c0fdb27d585"`);
        await queryRunner.query(`DROP TABLE "white_card"`);
        await queryRunner.query(`DROP TABLE "white_card_ref"`);
        await queryRunner.query(`DROP TYPE "white_card_ref_state_enum"`);
        await queryRunner.query(`DROP INDEX "username_idx"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP INDEX "IDX_c2154e87a486e734d9152bf16b"`);
        await queryRunner.query(`DROP INDEX "game_key_idx"`);
        await queryRunner.query(`DROP TABLE "game_round"`);
        await queryRunner.query(`DROP TABLE "black_card"`);
        await queryRunner.query(`ALTER TABLE "white_card" ALTER COLUMN "deck" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "white_card"."deck" IS NULL`);
        await queryRunner.query(`ALTER TABLE "black_card" ALTER COLUMN "deck" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "black_card"."deck" IS NULL`);
    }

}
