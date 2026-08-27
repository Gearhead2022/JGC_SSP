// src/socket/emitters/user.emitter.ts

import { getIO } from "@/socket";
import type { User } from "@repo/shared";

export function emitUserCreated(user: User) {
    getIO().emit("user:created", user);
}

export function emitUserUpdated(user: User) {
    getIO().emit("user:updated", user);
}