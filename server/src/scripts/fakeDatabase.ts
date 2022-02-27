import {createConnection} from "typeorm";
import faker from "@faker-js/faker";
import {User} from "../user/models/User";
import {Game} from "../game/models/Game";
import {v4 as uuidv4} from "uuid";
import {CardDeck} from "../deck/models/CardDeck";
import dotenv from "dotenv";
import ShortUniqueId from "short-unique-id";
import {getGameWithRelations} from "../game/services";
dotenv.config({path: '.env'})

async function main() {
  await createConnection()
  console.log('connection created')
  for (let i = 0; i < 50; i++) {
    await Promise.all(seedData(100));
    console.log("Games created: " + 100*(i+1))
  }
  console.log("Done.")
  return 0;
}

function seedData(gameCount: number): Promise<any>[] {
  const e: Promise<any>[] = []
  for (let i = 0; i < gameCount; i++) {
    e.push(createGameWithUsers())
  }
  return e
}

async function createGameWithUsers() {
  const host = await createUser().save();
  const game = createGame(host);
  const users = [
    createUser(),
    createUser(),
    createUser(),
    createUser(),
    createUser(),
    host,
  ]
  users.forEach((u) => {
    u.game_fk = game.key;
    u.hasPlayed = false;
    u.score = 0;
  })
  await game.save()
  await Promise.all(users.map((u) => u.save()))
  const g = await getGameWithRelations(game.key);
  await g.handOutCards();
  await g.assingCardWizz();
  await g.newBlackCard();
  await g.save()
  await Promise.all(g.users.map(u => u.save()))
}

function createUser(): User {
  const user = new User();
  user.password = faker.internet.password(44);
  user.email = faker.internet.email(faker.name.firstName() + faker.random.alphaNumeric(7));
  user.username = (user.email.split('@')[0] + faker.random.alphaNumeric(4)).substring(0, 19);
  return user
}

function createGame(user: User, cardDeck?: CardDeck): Game {
  const uid = new ShortUniqueId({ length: 5 });
  const game = new Game();
  game.key = uuidv4();
  game.joinKey = uid.randomUUID(5).toLocaleLowerCase()
  game.playCards = 5;
  game.playerLimit = 6;
  game.privateLobby = true;
  game.rounds = 4;
  game.hostUserId = user.id;
  if (cardDeck) {
    game.cardDeck = cardDeck;
  } else {
    game.card_deck_fk = 1;
  }
  user.game = game;
  user.score = 0;
  user.hasPlayed = false;
  return game
}

main();