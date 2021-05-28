import {MigrationInterface, QueryRunner} from "typeorm";

export class RelateGameToCardDeck1622238212312 implements MigrationInterface {
    name = 'RelateGameToCardDeck1622238212312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" RENAME COLUMN "card_deck" TO "card_deck_fk"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "card_deck_fk"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "card_deck_fk" integer`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_91e4135bd8e57d01ccd7286da35" FOREIGN KEY ("card_deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // idk some random shit typeorm REALLY want to do...
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "FK_785292f892370246dcecc2c01b0"`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "UQ_992f7867b7fcaeb50f9ddba8427"`);
        await queryRunner.query(`ALTER TABLE "white_card" ALTER COLUMN "deck_fk" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "FK_ed4b98658ee17dc7eed9e64b80e"`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "UQ_1f2a4228d3b4b5d7ded8306e9d6"`);
        await queryRunner.query(`ALTER TABLE "black_card" ALTER COLUMN "deck_fk" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "UQ_992f7867b7fcaeb50f9ddba8427" UNIQUE ("deck_fk", "text")`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "UQ_1f2a4228d3b4b5d7ded8306e9d6" UNIQUE ("text", "deck_fk")`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "FK_785292f892370246dcecc2c01b0" FOREIGN KEY ("deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "FK_ed4b98658ee17dc7eed9e64b80e" FOREIGN KEY ("deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "FK_ed4b98658ee17dc7eed9e64b80e"`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "FK_785292f892370246dcecc2c01b0"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_91e4135bd8e57d01ccd7286da35"`);
        await queryRunner.query(`ALTER TABLE "black_card" DROP CONSTRAINT "UQ_1f2a4228d3b4b5d7ded8306e9d6"`);
        await queryRunner.query(`ALTER TABLE "white_card" DROP CONSTRAINT "UQ_992f7867b7fcaeb50f9ddba8427"`);
        await queryRunner.query(`ALTER TABLE "black_card" ALTER COLUMN "deck_fk" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "UQ_1f2a4228d3b4b5d7ded8306e9d6" UNIQUE ("text", "deck_fk")`);
        await queryRunner.query(`ALTER TABLE "black_card" ADD CONSTRAINT "FK_ed4b98658ee17dc7eed9e64b80e" FOREIGN KEY ("deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "white_card" ALTER COLUMN "deck_fk" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "UQ_992f7867b7fcaeb50f9ddba8427" UNIQUE ("text", "deck_fk")`);
        await queryRunner.query(`ALTER TABLE "white_card" ADD CONSTRAINT "FK_785292f892370246dcecc2c01b0" FOREIGN KEY ("deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "card_deck_fk"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "card_deck_fk" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" RENAME COLUMN "card_deck_fk" TO "card_deck"`);
    }

}
