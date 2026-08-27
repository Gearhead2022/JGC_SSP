import { CreateRoleSchema, CreateUserSchema, PaginationMeta, Permission, Role, UpdateRoleSchema, UpdateUserSchema, User } from "@repo/shared";

export type UserFormProps = {
    mode: "create" | "edit";
    user?: User | null;
    roles: Role[];
    isSubmitting?: boolean;
    onCreate?: (data: CreateUserSchema) => void;
    onUpdate?: (data: UpdateUserSchema) => void;
};

export type Tab = "users" | "roles" | "permissions";

export type AccessControlContentProps = {
    users: User[];
    roles: Role[];
    permissions: Permission[];

    usersLoading?: boolean;

    userSearch: string;
    userLimit: number;
    userPagination?: PaginationMeta;

    onUserSearchChange: (value: string) => void;
    onUserLimitChange: (value: number) => void;
    onUserPageChange: (page: number) => void;

    onCreateUser: () => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;

    onCreateRole: () => void;
    onEditRole: (role: Role) => void;

    onPermissionChange: (
        roleId: number,
        permissionId: number,
        checked: boolean
    ) => void;
};

export type UserTableProps = {
    users: User[];
    usersLoading?: boolean;

    search: string;
    onSearchChange: (value: string) => void;

    limit: number;
    onLimitChange: (value: number) => void;

    onCreate: () => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;

    pagination?: PaginationMeta;
    onPageChange: (page: number) => void;
};

export type RoleFormProps = {
    mode: "create" | "edit";
    role?: Role | null;
    isSubmitting?: boolean;
    onCreate: (data: CreateRoleSchema) => void;
    onUpdate: (data: UpdateRoleSchema) => void;
};