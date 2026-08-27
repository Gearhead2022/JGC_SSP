import { Role } from "../../types";

export interface RoleServerToClientEvents {
    "role:created": (user: Role) => void;
    "role:updated": (user: Role) => void;
}