import { User } from './models/User'
import {AuthenticationError, CreateError} from "../error";
import bcrypt from "bcrypt";
import {WhiteCardRef} from "../card/models/WhiteCardRef";
import {CardDeckUserRef} from "../deck/models/CardDeckUserRef";
import {LoginInput} from "./schema";

/**
 * Get a user with relevant relations
 * @param userId - User to fetch
 * @param relations - Relations to get for user, if empty gets a default set.
 */
export const getUserWithRelation = async (userId: number, relations: Array<string> | undefined = undefined): Promise<User> => {
  try {
    return User.findOneOrFail(userId, {
      relations: relations ? relations : [
        '_cards',
        '_cards.white_card',
      ]
    })
  } catch(err) {
    throw new Error('User not found')
  }
}

interface CreateUserData {
  email: string
  password: string
  username: string
}

export const loginUser = async (input: LoginInput): Promise<User> => {
  const user = await User.createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = :email', { email: input.email.toLowerCase() })
      .getOne();
  if(!user) {
    throw new AuthenticationError(`Incorrect email or password`)
  }
  const passwordOk = await bcrypt.compare(input.password, user.password)
  if (!passwordOk) {
    throw new AuthenticationError('Incorrect email or password')
  }
  return user;
}

/**
 * Registers a new user to the app
 * Will register a user from the data of the body argument.
 *
 * Returns the newly created user on success
 * @param body
 */
export async function createUser (body: CreateUserData): Promise<User> {
  const existingUser = await User.createQueryBuilder('user')
    .where('LOWER(user.email) = :email', {email: body.email.toLowerCase()})
    .orWhere('LOWER(user.username) = :username', {username: body.username.toLowerCase()})
    .getOne();
  if (existingUser) {
    throw new CreateError('A user with same Email or Username already exist')
  }
  const user = new User();
  user.password = await bcrypt.hash(body.password, 10);
  user.email = body.email.toLowerCase();
  user.username = body.username;
  await user.save();
  const deckRef = new CardDeckUserRef();
  deckRef.user = user;
  deckRef.card_deck_fk = 3;
  await deckRef.save();
  return user
}

type UpdateUserData = Partial<CreateUserData> & { id: number };

export async function updateUser(input: UpdateUserData): Promise<User> {
  const user = await User.findOneOrFail(input.id);
  if (input.email) {
    user.email = input.email.toLowerCase();
  }
  if (input.username) {
    user.username = input.username;
  }
  if (input.password) {
    user.password = await bcrypt.hash(input.password, 10)
  }
  return user.save();
}

export async function getUserUserWithWinningCard(gameKey: string): Promise<User> {
  return User.createQueryBuilder('u')
    .leftJoin(WhiteCardRef, 'wcr', 'wcr.game_key = u.game_fk and wcr.user_id_fk = u.id')
    .where('wcr.game_key = :key', {key: gameKey})
    .andWhere(`wcr.state = 'winner'`)
    .getOne();
}
