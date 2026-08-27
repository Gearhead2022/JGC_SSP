import { z } from "zod";

import {
    createUserSchema,
    updateUserSchema,
    updateRolePermissionsSchema,
    createRoleSchema,
    updateRoleSchema
} from "@repo/shared";

/* =====================
   USER REQUEST SCHEMAS
===================== */

export const createUserRequestSchema = z.object({
    body: createUserSchema,
});

export const updateUserRequestSchema = z.object({
    params: z.object({
        userId: z.coerce.number().int().positive(),
    }),

    body: updateUserSchema,
});

export const deleteUserRequestSchema = z.object({
    params: z.object({
        userId: z.coerce.number().int().positive(),
    }),
});

/* =====================
   ROLE REQUEST SCHEMAS
===================== */

export const createRoleRequestSchema = z.object({
    body: createRoleSchema,
});

export const updateRoleRequestSchema = z.object({
    params: z.object({
        roleId: z.coerce.number().int().positive(),
    }),

    body: updateRoleSchema,
});

/* =====================
   ROLE PERMISSION REQUEST SCHEMAS
===================== */

export const updateRolePermissionsRequestSchema = z.object({
    params: z.object({
        roleId: z.coerce.number().int().positive(),
    }),

    body: updateRolePermissionsSchema,
});

/* =====================
   REQUEST TYPES
===================== */

export type CreateUserRequestSchema =
    z.infer<typeof createUserRequestSchema>;

export type UpdateUserRequestSchema =
    z.infer<typeof updateUserRequestSchema>;

export type CreateRoleRequestSchema =
    z.infer<typeof createRoleRequestSchema>;

export type UpdateRoleRequestSchema =
    z.infer<typeof updateRoleRequestSchema>;

export type UpdateRolePermissionsRequestSchema =
    z.infer<typeof updateRolePermissionsRequestSchema>;