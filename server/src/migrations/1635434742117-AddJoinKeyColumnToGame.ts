import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJoinKeyColumnToGame1635434742117 implements MigrationInterface {
    name = 'AddJoinKeyColumnToGame1635434742117'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
