import { io, type Socket } from "socket.io-client";

import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "@repo/shared";

const SOCKET_URL =
    process.env.NEXT_PUBLIC_BACKEND_LAN_URL;

let socket: Socket<
    ServerToClientEvents,
    ClientToServerEvents
> | null = null;

export const createSocket = () => {
    if (!socket) {
        socket = io<
            ServerToClientEvents,
            ClientToServerEvents
        >(SOCKET_URL!, {
            autoConnect: true,
            withCredentials: true,
        });
    }

    return socket;
};