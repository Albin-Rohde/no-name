import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJoinKeyColumnToGame1635434742117 implements MigrationInterface {
    name = 'AddJoinKeyColumnToGame1635434742117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // since we add a new non-nullable column to game, we need to delete all games in order to run migration.
        await queryRunner.query(`
            delete from white_card_ref;
            update player set game_fk = null;
            delete from game;
            delete from black_card_ref;
            delete from white_card_ref;
            delete from game_turn;
        `);
        await queryRunner.query(`ALTER TABLE "public"."game" ADD "join_key" character varying(5) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."game" ADD CONSTRAINT "UQ_bd29a5def078c0c25155795d89a" UNIQUE ("join_key")`);
        await queryRunner.query(`CREATE INDEX "IDX_bd29a5def078c0c25155795d89" ON "public"."game" ("join_key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bd29a5def078c0c25155795d89"`);
        await queryRunner.query(`ALTER TABLE "public"."game" DROP CONSTRAINT "UQ_bd29a5def078c0c25155795d89a"`);
        await queryRunner.query(`ALTER TABLE "public"."game" DROP COLUMN "join_key"`);
    }

}
