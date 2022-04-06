import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAdminColumnToUser1649281197126 implements MigrationInterface {
    name = 'AddAdminColumnToUser1649281197126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71"`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD "admin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71" FOREIGN KEY ("game_fk") REFERENCES "game"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE player SET admin=true WHERE email='admin@fasoner.party'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71"`);
        await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "admin"`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71" FOREIGN KEY ("game_fk") REFERENCES "game"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
