"use client";

import { useState } from "react";

import type {
    PaginationMeta,
    Permission,
    Role,
    User,
} from "@repo/shared";

import { Button } from "@/components/ui/button";
import PermissionGuard from "@/components/guards/PermissionGuard";

import { UserTable } from "../components/users/UserTable";
import { RoleTable } from "../components/roles/RoleTable";
import { PermissionMatrix } from "../components/permissions/PermissionMatrix";
import { Tab, AccessControlContentProps } from "../types/access-control.types";

export function AccessControlContent({
    users,
    roles,
    permissions,

    usersLoading = false,

    userSearch,
    userLimit,
    userPagination,

    onUserSearchChange,
    onUserLimitChange,
    onUserPageChange,

    onCreateUser,
    onEditUser,
    onDeleteUser,

    onCreateRole,
    onEditRole,

    onPermissionChange,
}: AccessControlContentProps) {
    const [tab, setTab] = useState<Tab>("users");

    return (
        <section className="space-y-6">
            <header className="space-y-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Access Control
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage users, roles, and permissions.
                    </p>
                </div>

                <nav className="flex justify-center">
                    <div className="flex gap-3">
                        <Button
                            variant={tab === "users" ? "default" : "secondary"}
                            onClick={() => setTab("users")}
                        >
                            Users
                        </Button>

                        <Button
                            variant={tab === "roles" ? "default" : "secondary"}
                            onClick={() => setTab("roles")}
                        >
                            Roles
                        </Button>

                        <Button
                            variant={tab === "permissions" ? "default" : "secondary"}
                            onClick={() => setTab("permissions")}
                        >
                            Permissions
                        </Button>
                    </div>
                </nav>
            </header>

            {tab === "users" && (
                <UserTable
                    users={users}
                    usersLoading={usersLoading}
                    search={userSearch}
                    onSearchChange={onUserSearchChange}
                    limit={userLimit}
                    onLimitChange={onUserLimitChange}
                    onCreate={onCreateUser}
                    onEdit={onEditUser}
                    onDelete={onDeleteUser}
                    pagination={userPagination}
                    onPageChange={onUserPageChange}
                />
            )}

            {tab === "roles" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <PermissionGuard
                            permissions={["ADMIN_MANAGE"]}
                        >
                            <Button
                                type="button"
                                onClick={onCreateRole}
                            >
                                Add Role
                            </Button>
                        </PermissionGuard>
                    </div>

                    <RoleTable
                        roles={roles}
                        onEdit={onEditRole}
                    />
                </div>
            )}

            {tab === "permissions" && (
                <PermissionGuard
                    permissions={["ADMIN_MANAGE"]}
                >
                    <PermissionMatrix
                        roles={roles}
                        permissions={permissions}
                        onChange={onPermissionChange}
                    />
                </PermissionGuard>
            )}
        </section>
    );
}