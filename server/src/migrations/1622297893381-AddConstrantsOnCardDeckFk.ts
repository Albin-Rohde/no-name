import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConstrantsOnCardDeckFk1622297893381 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE white_card ALTER COLUMN deck_fk SET NOT NULL');
      await queryRunner.query('ALTER TABLE black_card ALTER COLUMN deck_fk SET NOT NULL');
      await queryRunner.query('ALTER TABLE game ALTER COLUMN card_deck_fk SET NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE white_card ALTER COLUMN deck_fk DROP NOT NULL')
      await queryRunner.query('ALTER TABLE black_card ALTER COLUMN deck_fk DROP NOT NULL')
      await queryRunner.query('ALTER TABLE game ALTER COLUMN card_deck_fk DROP NOT NULL')
    }
}
