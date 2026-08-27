import { User } from "../types";

export interface UserServerToClientEvents {
    "user:created": (user: User) => void;
    "user:updated": (user: User) => void;
}