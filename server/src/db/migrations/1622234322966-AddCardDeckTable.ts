import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCardDeckTable1622234322966 implements MigrationInterface {
    name = 'AddCardDeckTable1622234322966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card_deck" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_1868245e5e6ebfa9fb4430f5ac9" UNIQUE ("name"), CONSTRAINT "PK_d49d410a9f987230b1f4e2c13c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1868245e5e6ebfa9fb4430f5ac" ON "card_deck" ("name") `);

        await queryRunner.query(`INSERT INTO card_deck (id, name, description) VALUES (1, 'yobots_en', 'Kosmoskulbbens card deck in english')`)
        await queryRunner.query(`INSERT INTO card_deck (id, name, description) VALUES (2, 'yobots_sv', 'Kosmoskulbbens card deck in swedish')`)

        // alter white_card
        await queryRunner.query(`ALTER TABLE "white_card" ADD COLUMN "deck_fk" integer`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "UQ_0723849a4fcf5cae3d13fc6bad8"`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "UQ_992f7867b7fcaeb50f9ddba8427" UNIQUE ("deck_fk", "text")`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "FK_785292f892370246dcecc2c01b0" FOREIGN KEY ("deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // alter black_card
        await queryRunner.query(`ALTER TABLE "black_card" ADD COLUMN "deck_fk" integer`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "UQ_e072db27ec070353974390f8b39"`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "UQ_1f2a4228d3b4b5d7ded8306e9d6" UNIQUE ("text", "deck_fk")`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "FK_ed4b98658ee17dc7eed9e64b80e" FOREIGN KEY ("deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // update white_card and black_card
        await queryRunner.query(`UPDATE white_card SET deck_fk=1 WHERE deck='yobots'`)
        await queryRunner.query(`UPDATE white_card SET deck_fk=2 WHERE deck='yobots_svenska'`)
        await queryRunner.query(`UPDATE black_card SET deck_fk=1 WHERE deck='yobots'`)
        await queryRunner.query(`UPDATE black_card SET deck_fk=2 WHERE deck='yobots_svenska'`)

        // set card_deck_fk not null
        await queryRunner.query(`ALTER TABLE "white_card" ALTER COLUMN "deck_fk" SET NOT NULL`)
        await queryRunner.query(`ALTER TABLE "black_card" ALTER COLUMN "deck_fk" SET NOT NULL`)

        // drop deck from white_card and black_card
        await queryRunner.query(`ALTER TABLE "white_card" DROP COLUMN "deck"`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP COLUMN "deck"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "white_card" ADD "deck" character varying`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD "deck" character varying`);

        await queryRunner.query(`UPDATE white_card SET deck='yobots' WHERE deck_fk=1`)
        await queryRunner.query(`UPDATE white_card SET deck='yobots_svenska' WHERE deck_fk=2`)
        await queryRunner.query(`UPDATE black_card SET deck='yobots' WHERE deck_fk=1`)
        await queryRunner.query(`UPDATE black_card SET deck='yobots_svenska' WHERE deck_fk=2`)

        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "FK_ed4b98658ee17dc7eed9e64b80e"`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "FK_785292f892370246dcecc2c01b0"`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "UQ_1f2a4228d3b4b5d7ded8306e9d6"`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "UQ_992f7867b7fcaeb50f9ddba8427"`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "UQ_e072db27ec070353974390f8b39" UNIQUE ("text")`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP COLUMN "deck_fk"`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP COLUMN "deck_fk"`);
        await queryRunner.query(`DROP INDEX "IDX_1868245e5e6ebfa9fb4430f5ac"`);
        await queryRunner.query(`DROP TABLE "card_deck"`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "UQ_0723849a4fcf5cae3d13fc6bad8" UNIQUE ("deck", "text")`);
    }
}
