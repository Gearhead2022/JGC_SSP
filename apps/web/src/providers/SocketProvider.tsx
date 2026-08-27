"use client";

// import { useNotificationSocket } from "@/hooks/socket/useNotificationSocket";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // useNotificationSocket();

    return (
        <>
            {children}
        </>
    );
}