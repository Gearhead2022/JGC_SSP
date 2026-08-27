"use client";

import { useState, useEffect } from "react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { AccessControlContent } from "./AccessControlContent";
import { Skeleton } from "boneyard-js/react";
import "@/bones/registry";
import Modal from "@/components/common/ModalHeader";
import { RoleForm } from "../components/roles/RoleForm";
import { UserForm } from "../components/users/UserForm";
import SweetAlert from "@/lib/alerts/alert";
import { AppToast } from "@/lib/toast";
import {
    usePermissions,
    useRoles,
    useUpdateRolePermissions,
    useUsers,
    useCreateUser,
    useUpdateUser,
    useCreateRole,
    useUpdateRole,
    useDeleteUser,
} from "../hooks/useAccessControl";
import { CreateRoleSchema, CreateUserSchema, Role, UpdateRoleSchema, UpdateUserSchema, User } from "@repo/shared";
import { useDebounce } from "@/hooks/useDebounce";
import { accessControlFixture } from "../fixtures/accessControlFixtures";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { useAccessControlSocket } from "../hooks/useAccessControlSocket";

export default function AccessControlView() {
    useAccessControlSocket()

    const userModal = useDisclosure(); // Modal Control USer
    const roleModal = useDisclosure(); // Modal Control Role

    const { mutateAsync: createUser, isPending: pendingCreateUser } = useCreateUser();
    const { mutateAsync: updateUser, isPending: pendingUpdateUser } = useUpdateUser();
    const { mutateAsync: deleteUser, isPending: pendingDeleteUser } = useDeleteUser();

    const { mutateAsync: createRole, isPending: pendingCreateRole } = useCreateRole();
    const { mutateAsync: updateRole, isPending: pendingUpdateRole } = useUpdateRole();

    const { mutateAsync: updatePermissions, isPending: pendingUpdatePermission } = useUpdateRolePermissions();

    const rolesQuery = useRoles();
    const permissionsQuery = usePermissions();

    const roles = rolesQuery.data?.data ?? [];
    const permissions = permissionsQuery.data?.data ?? [];

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);


    async function handlePermissionChange(
        roleId: number,
        permissionId: number,
        checked: boolean
    ) {
        const role = roles.find(
            (item) => item.id === roleId
        );

        if (!role) return;

        const currentIds = role.permissions.map(
            (item) => item.id
        );

        const permissionIds = checked
            ? [...new Set([...currentIds, permissionId])]
            : currentIds.filter(
                (id) => id !== permissionId
            );

        try {

            await updatePermissions({
                roleId,
                data: { permissionIds },
            });

            AppToast.success("Permissions updated successfully.");
        } catch {
            AppToast.error("Failed to update permissions.");
        }

    }

    // Role management

    function handleCreateRoleClick() {
        setSelectedRole(null);
        roleModal.open();
    }

    function handleEditRoleClick(role: Role) {
        setSelectedRole(role);
        roleModal.open();
    }

    async function handleCreateRole(data: CreateRoleSchema) {
        try {
            await createRole(data);

            roleModal.close();
            SweetAlert.successAlert(
                "Success",
                "Role created successfully."
            );
        } catch (error) {
            SweetAlert.errorAlert(
                "Failed",
                "Failed to created role."
            );
        }
    }

    async function handleUpdateRole(data: UpdateRoleSchema) {
        if (!selectedRole) return;
        try {
            await updateRole({ roleId: selectedRole.id, data });
            roleModal.close();
            setSelectedRole(null);

            SweetAlert.successAlert(
                "Success",
                "Role updated successfully."
            );
        } catch (error) {
            SweetAlert.errorAlert(
                "Failed",
                "Failed to update role."
            );
        }
    }

    function handleCloseRoleModal() {
        roleModal.close();
        setSelectedRole(null);
    }

    // User management 
    const [userPage, setUserPage] = useState(1);
    const [userLimit, setUserLimit] = useState(10);
    const [userSearch, setUserSearch] = useState("");
    const debouncedSearch = useDebounce(userSearch, 500);

    const usersQuery = useUsers({ page: userPage, limit: userLimit, search: debouncedSearch });
    const users = usersQuery.data?.data ?? [];

    function handleUserSearchChange(value: string) {
        setUserSearch(value);
        setUserPage(1);
    }

    function handleUserLimitChange(limit: number) {
        setUserLimit(limit);
        setUserPage(1);
    }

    function handleCloseUserModal() {
        userModal.close();
        setSelectedUser(null);
    }

    async function handleCreateUser(data: CreateUserSchema) {
        try {
            const response = await createUser(data);
            userModal.close();

            SweetAlert.successAlert(
                "Success",
                response.message
            );

        } catch (error) {
            SweetAlert.errorAlert(
                "Failed",
                getApiErrorMessage(
                    error,
                    "Failed to create user."
                )
            );
        }
    }

    async function handleUpdateUser(data: UpdateUserSchema) {
        if (!selectedUser) return;
        try {
            const response = await updateUser({ userId: selectedUser.id, data });
            userModal.close();
            setSelectedUser(null);

            SweetAlert.successAlert(
                "Success",
                response.message
            );

        } catch (error) {
            SweetAlert.errorAlert(
                "Failed",
                getApiErrorMessage(
                    error,
                    "Failed to update user."
                )
            );
        }
    }

    async function handleDeleteUser(user: User) {
        const confirmed = await SweetAlert.confirmationAlert2(
            "Delete User?",
            `This will permanently delete user ID ${user.id}. This cannot be undone.`
        );

        if (!confirmed) return;

        try {
            const response = await deleteUser(user.id);

            userModal.close();
            setSelectedUser(null);

            SweetAlert.successAlert(
                "Success",
                response.message
            );
        } catch (error) {
            SweetAlert.errorAlert(
                "Failed",
                getApiErrorMessage(
                    error,
                    "Failed to delete user."
                )
            );
        }
    }

    function handleCreateUserClick() {
        setSelectedUser(null);
        userModal.open();
    }

    function handleEditUserClick(user: User) {
        setSelectedUser(user);
        userModal.open();
    }

    const isInitialLoading =
        usersQuery.isPending ||
        rolesQuery.isPending ||
        permissionsQuery.isPending;

    // Development only: keep skeleton visible longer
    // const [showSkeleton, setShowSkeleton] = useState(true);

    // useEffect(() => {
    //     if (isLoading) {
    //         setShowSkeleton(true);
    //         return;
    //     }

    //     const timer = setTimeout(() => {
    //         setShowSkeleton(false);
    //     }, 3000);

    //     return () => clearTimeout(timer);
    // }, [isLoading]);

    return (
        <>
            <Skeleton
                name="admin-access-control"
                // loading={showSkeleton}
                loading={isInitialLoading}
                fixture={
                    <AccessControlContent
                        users={accessControlFixture.users}
                        roles={accessControlFixture.roles}
                        permissions={accessControlFixture.permissions}
                        userSearch=""
                        userLimit={10}
                        userPagination={undefined}

                        onUserSearchChange={() => { }}
                        onUserLimitChange={() => { }}
                        onUserPageChange={() => { }}

                        onCreateUser={() => { }}
                        onEditUser={() => { }}
                        onDeleteUser={() => { }}

                        onCreateRole={() => { }}
                        onEditRole={() => { }}

                        onPermissionChange={() => { }}
                    />
                }
                transition
            >
                <AccessControlContent
                    users={users}
                    usersLoading={usersQuery.isFetching}

                    roles={roles}
                    permissions={permissions}
                    userSearch={userSearch}
                    userLimit={userLimit}
                    userPagination={usersQuery.data?.pagination}
                    onUserSearchChange={handleUserSearchChange}
                    onUserLimitChange={handleUserLimitChange}
                    onUserPageChange={setUserPage}

                    onCreateUser={handleCreateUserClick}
                    onEditUser={handleEditUserClick}
                    onDeleteUser={handleDeleteUser}

                    onCreateRole={handleCreateRoleClick}
                    onEditRole={handleEditRoleClick}

                    onPermissionChange={handlePermissionChange}
                />
            </Skeleton>

            {/* USER MODAL */}
            <Modal
                isOpen={userModal.isOpen}
                onClose={handleCloseUserModal}
                title={selectedUser ? "Edit User" : "Create User"}
                size="md"
                footer={
                    <>
                        <Button
                            type="button"
                            onClick={() => {
                                userModal.close();
                                setSelectedUser(null);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form="user-form"
                            disabled={
                                pendingCreateUser ||
                                pendingUpdateUser
                            }
                        >
                            {selectedUser ? "Update" : "Save"}
                        </Button>
                    </>
                }
            >
                <UserForm
                    mode={selectedUser ? "edit" : "create"}
                    user={selectedUser}
                    roles={roles}
                    onCreate={handleCreateUser}
                    onUpdate={handleUpdateUser}
                    isSubmitting={
                        pendingCreateUser ||
                        pendingUpdateUser
                    }
                />
            </Modal>

            {/* ROLE MODAL */}
            <Modal
                isOpen={roleModal.isOpen}
                onClose={handleCloseRoleModal}
                title={
                    selectedRole
                        ? "Edit Role"
                        : "Create Role"
                }
                size="md"
                footer={
                    <>
                        <Button
                            type="button"
                            onClick={() => {
                                roleModal.close();
                                setSelectedRole(null);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form="role-form"
                            disabled={
                                pendingCreateRole ||
                                pendingUpdateRole
                            }
                        >
                            {selectedRole ? "Update" : "Save"}
                        </Button>
                    </>
                }
            >
                <RoleForm
                    mode={selectedRole ? "edit" : "create"}
                    role={selectedRole}
                    onCreate={handleCreateRole}
                    onUpdate={handleUpdateRole}
                    isSubmitting={
                        pendingCreateRole ||
                        pendingUpdateRole
                    }
                />
            </Modal>
        </>
    );
}