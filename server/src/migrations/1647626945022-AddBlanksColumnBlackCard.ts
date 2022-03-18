import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBlanksColumnBlackCard1647626945022 implements MigrationInterface {
    name = 'AddBlanksColumnBlackCard1647626945022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71"`);
        await queryRunner.query(`ALTER TABLE "public"."black_card" ADD "blanks" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`CREATE INDEX "IDX_ed4b98658ee17dc7eed9e64b80" ON "public"."black_card" ("deck_fk") `);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71" FOREIGN KEY ("game_fk") REFERENCES "game"("key") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed4b98658ee17dc7eed9e64b80"`);
        await queryRunner.query(`ALTER TABLE "public"."black_card" DROP COLUMN "blanks"`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "FK_46393e0d6dc5b13e2b676fe0a71" FOREIGN KEY ("game_fk") REFERENCES "game"("key") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
