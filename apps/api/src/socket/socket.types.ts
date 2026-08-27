import type { Server, Socket } from "socket.io";
import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "@repo/shared";

export type AppSocketServer = Server<
    ClientToServerEvents,
    ServerToClientEvents
>;

export type AppSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents
>;