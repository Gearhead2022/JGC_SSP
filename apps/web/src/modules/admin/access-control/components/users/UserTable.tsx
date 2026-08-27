import type { User } from "@repo/shared";
import { Table, type TableColumn } from "@/components/common/Table";
import PermissionGuard from "@/components/guards/PermissionGuard";
import { Button } from "@/components/ui/button";
import { UserTableProps } from "../../types/access-control.types";
import { Printer, Power } from "lucide-react";

export function UserTable({
    users,
    usersLoading = false,
    search,
    onSearchChange,
    limit,
    onLimitChange,
    onCreate,
    onEdit,
    onDelete,
    pagination,
    onPageChange,
}: UserTableProps) {

    const columns: TableColumn<User>[] = [
        {
            key: "name",
            header: "Name",
            render: (user) => user.name,
        },
        {
            key: "username",
            header: "Username",
            render: (user) => user.username,
        },
        {
            key: "email",
            header: "Email",
            render: (user) => user.email ?? "-",
        },
        {
            key: "roles",
            header: "Roles",
            render: (user) => user.roles.join(", "),
        },
        {
            key: "status",
            header: "Status",
            render: (user) =>
                user.isActive
                    ? "Active"
                    : "Inactive",
        },
    ];

    function handleActivate() {
        console.log('sample handler');
    }

    function handlePrint() {
        console.log('print');
    }

    return (
        <Table<User>
            title="Users"
            description="Manage system users and assigned roles."

            columns={columns}
            data={users}

            isLoading={usersLoading}

            search={search}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search users..."

            limit={limit}
            onLimitChange={onLimitChange}
            limitOptions={[5, 10, 25, 50, 100]}

            actions={
                <PermissionGuard
                    permissions={["ADMIN_MANAGE"]}
                >
                    <Button
                        type="button"
                        onClick={onCreate}
                    >
                        Create User
                    </Button>
                </PermissionGuard>
            }

            onEdit={onEdit}
            onDelete={onDelete}

            pagination={pagination}
            onPageChange={onPageChange}

            emptyMessage="No users found."

            rowKey={(user) => user.id}

            rowActions={[
                {
                    key: "activate",
                    label: "Activate",
                    icon: <Power size={14} />,
                    permission: "ADMIN_MANAGE",
                    hidden: (user) => user.isActive,
                    onClick: handleActivate,
                },
                {
                    key: "print",
                    label: "Print",
                    icon: <Printer size={14} />,
                    permission: "ADMIN_MANAGE",
                    onClick: handlePrint,
                },
            ]}
        />
    );
}