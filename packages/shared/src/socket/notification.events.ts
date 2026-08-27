export interface NotificationClientToServerEvents {
    "notification:read": (notificationId: number) => void;
}