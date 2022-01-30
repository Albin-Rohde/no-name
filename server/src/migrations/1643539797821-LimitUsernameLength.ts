import {MigrationInterface, QueryRunner} from "typeorm";

export class LimitUsernameLength1643539797821 implements MigrationInterface {
    name = 'LimitUsernameLength1643539797821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."username_idx"`);
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8"`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD "username_tmp" character varying(20) NOT NULL`);
        await queryRunner.query(`UPDATE "public"."player" SET "username_tmp" = "username"`);
        await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "public"."player" RENAME "username_tmp" TO "username"`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8" UNIQUE ("username")`);
        await queryRunner.query(`CREATE INDEX "username_idx" ON "public"."player" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."username_idx"`);
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8"`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD "username_tmp" character varying NOT NULL`);
        await queryRunner.query(`UPDATE "public"."player" SET "username_tmp" = "username"`);
        await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "public"."player" RENAME "username_tmp" TO "username"`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8" UNIQUE ("username")`);
        await queryRunner.query(`CREATE INDEX "username_idx" ON "public"."player" ("username") `);
    }

}
