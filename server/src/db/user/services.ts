import { User } from './models/User'

/**
 * Get a user with relevant relations
 * @param userId - User to fetch
 * @param relations - Relations to get for user, if empty gets a default set.
 */
const getUserWithRelation = async (userId: number, relations: Array<string> | undefined = undefined) => {
  try {
    return User.findOneOrFail(userId, {
      relations: relations ? relations : [
        'cards',
        'cards.white_card',
      ]
    })
  } catch(err) {
    throw new Error('User not found')
  }
}

export { getUserWithRelation }
