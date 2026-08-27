import type { UserServerToClientEvents } from "./user.events";
import type { NotificationClientToServerEvents } from "./notification.events";
import type { RoleServerToClientEvents } from "./admin/role.events";

export interface ServerToClientEvents
    extends UserServerToClientEvents, RoleServerToClientEvents { }

export interface ClientToServerEvents
    extends NotificationClientToServerEvents { }