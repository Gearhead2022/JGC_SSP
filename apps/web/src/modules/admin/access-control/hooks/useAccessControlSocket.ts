"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSocket } from "@/lib/socket/socket-client";

export function useAccessControlSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = createSocket();

        const handleUserCreated = () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        };

        const handleUserUpdated = () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        };

        socket.on("user:created", handleUserCreated);
        socket.on("user:updated", handleUserUpdated);

        return () => {
            socket.off("user:created", handleUserCreated);
            socket.off("user:updated", handleUserUpdated);
        };
    }, [queryClient]);
}