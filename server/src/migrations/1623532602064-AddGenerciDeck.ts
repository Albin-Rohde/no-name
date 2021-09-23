import {MigrationInterface, QueryRunner} from "typeorm";
import {addCardsToDb} from "../scripts/populateGeneric";

export class AddGenerciDeck1623532602064 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`INSERT INTO card_deck (id, name, description) VALUES (3, 'no_name_sv', 'Generic card deck in swedish')`)
      const sql_white_verb = await addCardsToDb('white_verb')
      const sql_white_noun = await addCardsToDb('white_noun')
      const sql_black = await addCardsToDb('black')
      await queryRunner.query(sql_white_verb)
      await queryRunner.query(sql_white_noun)
      await queryRunner.query(sql_black)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DELETE FROM white_card WHERE deck_fk = 3`)
      await queryRunner.query(`DELETE FROM black_card WHERE deck_fk = 3`)
      await queryRunner.query(`DELETE FROM card_deck WHERE id = 3`)
    }

}
