import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import {
    createRoleService,
    createUserService,
    getPermissionsService,
    getRolesService,
    getUsersService,
    updateRoleService,
    updateRolePermissionsService,
    updateUserService,
    deleteUserService,
} from "../service/access-control.service";
import { ApiResponse, Permission, Role, UpdateRolePermissionsSchema, UpdateUserSchema, User } from "@repo/shared";
import { UserQueryParams } from "@repo/shared";

export function useUsers(params: UserQueryParams) {
    return useQuery<ApiResponse<User[]>>({
        queryKey: ["access-control", "users", params],
        queryFn: () => getUsersService(params),
        placeholderData: keepPreviousData,
    });
}

export function useRoles() {
    return useQuery<ApiResponse<Role[]>>({
        queryKey: ["access-control", "roles"],
        queryFn: getRolesService,
    });
}

export function usePermissions() {
    return useQuery<ApiResponse<Permission[]>>({
        queryKey: ["access-control", "permissions"],
        queryFn: getPermissionsService,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUserService,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-control", "users"],
            });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: {
            userId: number;
            data: UpdateUserSchema;
        }) => updateUserService(userId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-control", "users"],
            });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) =>
            deleteUserService(userId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-control", "users"],
            });
        },
    });
}


// Roles

export function useCreateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRoleService,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-control", "roles"],
            });
        },
    });
}

export function useUpdateRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roleId, data }: {
            roleId: number;
            data: UpdateUserSchema;
        }) => updateRoleService(roleId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-control", "roles"],
            });
        },
    });
}

export function useUpdateRolePermissions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roleId, data }: {
            roleId: number;
            data: UpdateRolePermissionsSchema;
        }) => updateRolePermissionsService(roleId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-control", "roles"],
            });
        },
    });
}