import {Server} from "socket.io";
import {SocketWithSession} from "../../types";

export type EventFunction = (io: Server, socket: SocketWithSession, ...args: unknown[]) => Promise<void>
