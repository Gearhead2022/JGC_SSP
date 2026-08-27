// access-control.routes.ts

import { Router } from "express";

import {
    createRoleController,
    createUserController,
    deleteUserController,
    getPermissionsController,
    getRolesController,
    getUsersController,
    updateRoleController,
    updateRolePermissionsController,
    updateUserController,
} from "./access-control.controller";

import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { validate } from "@/middleware/validate.middleware";

import {
    createRoleRequestSchema,
    createUserRequestSchema,
    updateRolePermissionsRequestSchema,
    updateRoleRequestSchema,
    updateUserRequestSchema,
    deleteUserRequestSchema,
} from "./access-control.schema";

const router = Router();

/* =====================
   AUTHENTICATION
===================== */

router.use(authenticate);

/* =====================
   USERS
===================== */

router.get(
    "/users",
    authorize({
        roles: ["ADMIN"],
        permissions: ["users.read", "ADMIN_MANAGE"],
    }),
    getUsersController
);

router.post(
    "/users",
    authorize({
        roles: ["ADMIN"],
        permissions: ["users.create", "ADMIN_MANAGE"],
    }),
    validate(createUserRequestSchema),
    createUserController
);

router.patch(
    "/users/:userId",
    authorize({
        roles: ["ADMIN"],
        permissions: ["users.update", "ADMIN_MANAGE"],
    }),
    validate(updateUserRequestSchema),
    updateUserController
);

router.delete(
    "/users/:userId",
    authorize({
        roles: ["ADMIN"],
        permissions: ["users.delete", "ADMIN_MANAGE"],
    }),
    validate(deleteUserRequestSchema),
    deleteUserController
);

/* =====================
   ROLES
===================== */

router.get(
    "/roles",
    authorize({
        roles: ["ADMIN"],
        permissions: ["roles.read", "ADMIN_MANAGE"],
    }),
    getRolesController
);

router.post(
    "/roles",
    authorize({
        roles: ["ADMIN"],
        permissions: ["roles.create", "ADMIN_MANAGE"],
    }),
    validate(createRoleRequestSchema),
    createRoleController
);

router.patch(
    "/roles/:roleId",
    authorize({
        roles: ["ADMIN"],
        permissions: ["roles.update", "ADMIN_MANAGE"],
    }),
    validate(updateRoleRequestSchema),
    updateRoleController
);

/* =====================
   PERMISSIONS
===================== */

router.get(
    "/permissions",
    authorize({
        roles: ["ADMIN"],
        permissions: ["permissions.read", "ADMIN_MANAGE"],
    }),
    getPermissionsController
);

router.put(
    "/roles/:roleId/permissions",
    authorize({
        roles: ["ADMIN"],
        permissions: ["permissions.assign", "ADMIN_MANAGE"],
    }),
    validate(updateRolePermissionsRequestSchema),
    updateRolePermissionsController
);

export default router;