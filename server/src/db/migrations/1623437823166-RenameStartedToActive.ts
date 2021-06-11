import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameStartedToActive1623437823166 implements MigrationInterface {
    name = 'RenameStartedToActive1623437823166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" RENAME COLUMN "started" TO "active"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" RENAME COLUMN "active" TO "started"`);
    }

}
