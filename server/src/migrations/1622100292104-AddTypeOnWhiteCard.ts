import {MigrationInterface, QueryRunner} from "typeorm";
import {addCardsToDb} from "../../scripts/populateSwedish";

export class AddTypeOnWhiteCard1622100292104 implements MigrationInterface {
    name = 'AddTypeOnWhiteCard1622100292104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "white_card_type_enum" AS ENUM('noun', 'verb', 'definite', 'unknown')`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD "type" "white_card_type_enum" NOT NULL DEFAULT 'unknown'`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "UQ_9c4c340371e71ab2de609423bfc"`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "UQ_0723849a4fcf5cae3d13fc6bad8" UNIQUE ("deck", "text")`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "UQ_e072db27ec070353974390f8b39"`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "UQ_e072db27ec070353974390f8b39" UNIQUE ("deck", "text")`);

        const sql_white_verb = await addCardsToDb('white_verb')
        const sql_white_noun = await addCardsToDb('white_noun')
        const sql_white_definite = await addCardsToDb('white_definite')
        const sql_black = await addCardsToDb('black')
        await queryRunner.query(sql_white_verb)
        await queryRunner.query(sql_white_noun)
        await queryRunner.query(sql_white_definite)
        await queryRunner.query(sql_black)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "UQ_0723849a4fcf5cae3d13fc6bad8"`);
        await queryRunner.query(`DELETE FROM white_card WHERE deck='yobots_svenska'`)
        await queryRunner.query(`DELETE FROM black_card WHERE deck='yobots_svenska'`)
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "UQ_9c4c340371e71ab2de609423bfc" UNIQUE ("text")`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "white_card_type_enum"`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "UQ_e072db27ec070353974390f8b39"`);
    }

}
