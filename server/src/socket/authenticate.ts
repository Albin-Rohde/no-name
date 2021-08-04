import {getUserWithRelation} from "../db/user/services";
import {SocketWithSession} from "./index";
import {AuthenticationError} from "../rest/error";
import {User} from "../db/user/models/User";
import {socketLogger} from "../logger";
import {Events} from "./events/event-handler";

export const authSocketUser = async (socket: SocketWithSession): Promise<User> => {
  if(!socket.request.session.user) {
    throw new AuthenticationError('User required on session')
  }
  const user = await getUserWithRelation(socket.request.session.user.id)
  if(user) {
    socket.request.session.user = user
    socket.request.session.save()
  } else {
    throw new AuthenticationError('Authentication for user failed.')
  }
  return user
}


interface SocketEventInfo {
  eventName: Events
  eventMethod: string
  arguments: any[]
  userId: number
  gameId?: string
}
export const loggerMiddleware = (socket: SocketWithSession, info: SocketEventInfo): void => {
  socketLogger.info('Received socket event', info)
}
