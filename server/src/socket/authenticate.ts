import {Server, Socket} from "socket.io";
import {getUserWithRelation} from "../db/user/services";

export const authSocketUser = async (socket: Socket, io: Server, next: any) => {
  if(!socket.request.session.user) {
    throw new Error('User required on session')
  }
  const user = await getUserWithRelation(socket.request.session.user.id)
  if(user) {
    socket.request.session.user = user
    socket.request.session.save()
    next()
  } else {
    throw new Error('Authentication for user failed.')
  }
}