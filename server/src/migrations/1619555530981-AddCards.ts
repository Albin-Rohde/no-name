import {MigrationInterface, QueryRunner} from "typeorm";
import {addCardsToDb} from "../../scripts/populate";

export class AddCards1619555530981 implements MigrationInterface {
  name = 'AddCards1619555530981'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql_black = await addCardsToDb('black')
    const sql_white = await addCardsToDb('white')
    await queryRunner.query(sql_black)
    await queryRunner.query(sql_white)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE black_card CASCADE')
    await queryRunner.query('TRUNCATE TABLE white_card CASCADE')
  }
}