import api from "@/lib/api/api-client";

import {
    ApiResponse,
    User,
    Role,
    Permission,
    CreateUserSchema,
    UpdateUserSchema,
    CreateRoleSchema,
    UpdateRoleSchema,
    UpdateRolePermissionsSchema,
    UserQueryParams
} from "@repo/shared";

/* =====================
   API CALLS
===================== */

// USERS
export const getUsersService = async (
    params: UserQueryParams
): Promise<ApiResponse<User[]>> => {
    const res = await api.get<ApiResponse<User[]>>(
        "/admin/access-control/users",
        { params }
    );

    return res.data;
};

export const createUserService = async (
    params: CreateUserSchema
): Promise<ApiResponse<User>> => {
    const res = await api.post<ApiResponse<User>>(
        "/admin/access-control/users",
        params
    );

    return res.data;
};

export const updateUserService = async (
    userId: number,
    params: UpdateUserSchema
): Promise<ApiResponse<User>> => {
    const res = await api.patch<ApiResponse<User>>(
        `/admin/access-control/users/${userId}`,
        params
    );

    return res.data;
};

export const deleteUserService = async (
    userId: number,
): Promise<ApiResponse<null>> => {
    const res = await api.delete<ApiResponse<null>>(
        `/admin/access-control/users/${userId}`
    );

    return res.data;
};

// ROLES
export const getRolesService = async (): Promise<
    ApiResponse<Role[]>
> => {
    const res = await api.get<ApiResponse<Role[]>>(
        "/admin/access-control/roles"
    );

    return res.data;
};

export const createRoleService = async (
    params: CreateRoleSchema
): Promise<ApiResponse<Role>> => {
    const res = await api.post<ApiResponse<Role>>(
        "/admin/access-control/roles",
        params,
    );

    return res.data;
};

export const updateRoleService = async (
    roleId: number,
    params: UpdateRoleSchema
): Promise<ApiResponse<Role>> => {
    const res = await api.patch<ApiResponse<Role>>(
        `/admin/access-control/roles/${roleId}`,
        params,
    );

    return res.data;
};

// PERMISSIONS
export const getPermissionsService = async (): Promise<
    ApiResponse<Permission[]>
> => {
    const res = await api.get<ApiResponse<Permission[]>>(
        "/admin/access-control/permissions",
    );

    return res.data;
};

export const updateRolePermissionsService = async (
    roleId: number,
    params: UpdateRolePermissionsSchema
): Promise<ApiResponse<Role>> => {
    const res = await api.put<ApiResponse<Role>>(
        `/admin/access-control/roles/${roleId}/permissions`,
        params,
    );

    return res.data;
};