import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCardDeckUserRefModel1645988288431 implements MigrationInterface {
    name = 'AddCardDeckUserRefModel1645988288431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card_deck_user_ref" ("id" SERIAL NOT NULL, "user_id_fk" integer NOT NULL, "card_deck_fk" integer NOT NULL, CONSTRAINT "PK_21c3f3abd815257fd7d839fed73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "card_deck_user_ref" ADD CONSTRAINT "FK_d9ad3b38ede80eff289099a3125" FOREIGN KEY ("user_id_fk") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_deck_user_ref" ADD CONSTRAINT "FK_ad5d7cfbe952fe2327c8f709de9" FOREIGN KEY ("card_deck_fk") REFERENCES "card_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        /** Add all cards to admins ref */
        await queryRunner.query(`INSERT INTO "card_deck_user_ref" (user_id_fk, card_deck_fk) VALUES (1, 1)`)
        await queryRunner.query(`INSERT INTO "card_deck_user_ref" (user_id_fk, card_deck_fk) VALUES (1, 2)`)
        await queryRunner.query(`INSERT INTO "card_deck_user_ref" (user_id_fk, card_deck_fk) VALUES (1, 3)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card_deck_user_ref" DROP CONSTRAINT "FK_ad5d7cfbe952fe2327c8f709de9"`);
        await queryRunner.query(`ALTER TABLE "card_deck_user_ref" DROP CONSTRAINT "FK_d9ad3b38ede80eff289099a3125"`);
        await queryRunner.query(`DROP TABLE "card_deck_user_ref"`);
    }

}
