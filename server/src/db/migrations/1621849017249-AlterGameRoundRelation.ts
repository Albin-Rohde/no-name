import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterGameRoundRelation1621849017249 implements MigrationInterface {
    name = 'AlterGameRoundRelation1621849017249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_fa4ab926bd2ea753958fa56373a"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "REL_fa4ab926bd2ea753958fa56373"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "current_round"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "current_round_number" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "game" ADD "game_round_fk" uuid`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_67caa6977086f2120a3f1acd4b6" UNIQUE ("game_round_fk")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_67caa6977086f2120a3f1acd4b6" FOREIGN KEY ("game_round_fk") REFERENCES "game_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_67caa6977086f2120a3f1acd4b6"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_67caa6977086f2120a3f1acd4b6"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "game_round_fk"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "current_round_number"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "current_round" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "REL_fa4ab926bd2ea753958fa56373" UNIQUE ("key", "current_round")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_fa4ab926bd2ea753958fa56373a" FOREIGN KEY ("key", "current_round") REFERENCES "game_round"("game_key_fk","round_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
