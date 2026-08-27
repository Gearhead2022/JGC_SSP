// access-control.service.ts

import { AppError } from "@/errors/app-error";
import { ErrorCodes } from "@/errors/error-codes";
import { hashPassword } from "../../auth/internal/password.service";
import * as accessControlRepository from "./access-control.repository";
import { mapRole, mapUser } from "./access-control.mapper";
import type { CreateUserSchema, UpdateUserSchema, UpdateRolePermissionsSchema, CreateRoleSchema, UpdateRoleSchema, UserQueryParams } from "@repo/shared";

/* =====================
   USERS
===================== */

export async function getUsers(params: UserQueryParams) {
    const users =
        await accessControlRepository.findAllUsers(params);

    return {
        data: users.data.map(mapUser),
        pagination: users.pagination,
    };
}


export async function createUser(
    params: CreateUserSchema
) {
    const {
        name,
        username,
        email,
        password,
        roleIds,
    } = params;

    const duplicate =
        await accessControlRepository.findDuplicateUser(
            username,
            email
        );

    if (duplicate) {
        throw new AppError(
            "Username or email already exists",
            409,
            ErrorCodes.USER_ALREADY_EXISTS
        );
    }

    const hashedPassword =
        await hashPassword(password);

    const user =
        await accessControlRepository.createUser({
            name,
            username,
            email,
            password: hashedPassword,
            roleIds,
        });

    return mapUser(user);
}


export async function updateUser(
    userId: number,
    params: UpdateUserSchema
) {
    const user =
        await accessControlRepository.findUserById(
            userId
        );

    if (!user) {
        throw new AppError(
            "User not found",
            404,
            ErrorCodes.USER_NOT_FOUND
        );
    }

    const {
        password,
        ...rest
    } = params;

    let hashedPassword: string | undefined;

    if (password) {
        hashedPassword =
            await hashPassword(password);
    }

    const updatedUser =
        await accessControlRepository.updateUser(
            userId,
            {
                ...rest,

                ...(hashedPassword && {
                    password: hashedPassword,
                }),
            }
        );

    return updatedUser;
}

export const deleteUserService = async (userId: number) => {
    const user = await accessControlRepository.findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
    }

    await accessControlRepository.deleteUser(userId);
};

/* =====================
   ROLES
===================== */

export async function getRoles() {
    const roles =
        await accessControlRepository.findAllRoles();

    return roles.map(mapRole);
}


export async function createRole(
    params: CreateRoleSchema
) {
    return accessControlRepository.createRole(
        params
    );
}


export async function updateRole(
    roleId: number,
    params: UpdateRoleSchema
) {
    const role =
        await accessControlRepository.findRoleById(
            roleId
        );

    if (!role) {
        throw new AppError(
            "Role not found",
            404,
            ErrorCodes.ROLE_NOT_FOUND
        );
    }

    return accessControlRepository.updateRole(
        roleId,
        params
    );
}


/* =====================
   PERMISSIONS
===================== */

export async function getPermissions() {
    return accessControlRepository.findAllPermissions();
}


export async function updateRolePermissions(
    roleId: number,
    params: UpdateRolePermissionsSchema
) {
    const role =
        await accessControlRepository.findRoleById(
            roleId
        );

    if (!role) {
        throw new AppError(
            "Role not found",
            404,
            ErrorCodes.ROLE_NOT_FOUND
        );
    }

    await accessControlRepository.updateRolePermissions(
        roleId,
        params.permissionIds
    );

    return {
        message: "Permissions updated successfully",
    };
}