import { authenticateSocket } from "./socket-auth";
import { chatHandler } from "./handlers/chat.handler";
import { notificationHandler } from "./handlers/notification.handler";
import { AppSocketServer } from "./socket.types";

let ioInstance: AppSocketServer | null = null;

export function registerSocketHandlers(io: AppSocketServer) {
    // Store initialized Socket.IO server
    ioInstance = io;

    // Authentication middleware
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        console.log("Authenticated user:", socket.data.user);

        notificationHandler(io, socket);
        chatHandler(io, socket);

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });
    });
}


export function getIO(): AppSocketServer {
    if (!ioInstance) {
        throw new Error("Socket.IO is not initialized");
    }

    return ioInstance;
}