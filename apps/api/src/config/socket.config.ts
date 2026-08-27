import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { env } from "./env";
import { registerSocketHandlers } from "@/socket";

import type { ServerToClientEvents, ClientToServerEvents } from "@repo/shared";
import { AppSocketServer } from "@/socket/socket.types";

const allowedOrigins = [
    env.FRONTEND_URL,
    env.FRONTEND_LAN_URL,
];

export function initializeSocket(server: HttpServer) {
    const io: AppSocketServer = new SocketIOServer<
        ClientToServerEvents,
        ServerToClientEvents
    >(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });
    registerSocketHandlers(io);

    return io;
}