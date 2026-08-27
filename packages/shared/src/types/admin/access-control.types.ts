import { QueryParams } from "../query.types";

export type Permission = {
    id: number;
    code: string;
    name: string;
    description: string;
};

export type Role = {
    id: number;
    name: string;
    description?: string | null;
    permissions: Permission[];
};

export type CreateUserInput = {
    name: string;
    username: string;
    email?: string;
    password: string;
    roleIds: number[];
};

export type UpdateUserInput = {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    roleIds?: number[];
    isActive?: boolean;
};

export type CreateRoleInput = {
    name: string;
    description?: string;
};

export type UpdateRoleInput = {
    name?: string;
    description?: string;
};

export type UpdateRolePermissionsInput = {
    roleId: number;
    permissionIds: number[];
};

export interface UserQueryParams extends QueryParams {
    role?: string;
    status?: "all" | "active" | "inactive";
}
