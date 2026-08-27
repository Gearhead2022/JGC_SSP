// components/users/UserForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    createUserSchema,
    updateUserSchema,
    type CreateUserSchema,
    type UpdateUserSchema,
} from "@repo/shared";

import { UserFormProps } from "../../types/access-control.types";

export function UserForm({
    mode,
    user,
    roles,
    isSubmitting = false,
    onCreate,
    onUpdate,
}: UserFormProps) {
    const isEdit = mode === "edit";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserSchema | UpdateUserSchema>({
        resolver: zodResolver(
            isEdit ? updateUserSchema : createUserSchema
        ),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            roleIds: [],
            isActive: true,
        },
    });

    useEffect(() => {
        if (isEdit && user) {
            reset({
                name: user.name,
                username: user.username,
                email: user.email ?? "",
                password: "",
                roleIds: user.roles.map(Number),
                isActive: user.isActive,
            });

            return;
        }

        reset({
            name: "",
            username: "",
            email: "",
            password: "",
            roleIds: [],
        });
    }, [isEdit, user, reset]);

    const submit = (data: CreateUserSchema | UpdateUserSchema) => {
        if (isEdit) {
            onUpdate?.(data as UpdateUserSchema);
            return;
        }

        onCreate?.(data as CreateUserSchema);
    };

    return (
        <form
            id="user-form"
            onSubmit={handleSubmit(submit)}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium text-black">
                    Name
                </label>

                <input
                    {...register("name")}
                    className="w-full rounded-md border border-black px-3 py-2 text-black"
                />

                {errors.name?.message && (
                    <p className="text-sm text-red-600">
                        {String(errors.name.message)}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-black">
                    Username
                </label>

                <input
                    {...register("username")}
                    className="w-full rounded-md border border-black px-3 py-2 text-black"
                />

                {errors.username?.message && (
                    <p className="text-sm text-red-600">
                        {String(errors.username.message)}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-black">
                    Email
                </label>

                <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-md border border-black px-3 py-2 text-black"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-black">
                    Password
                </label>

                <input
                    type="password"
                    {...register("password")}
                    placeholder={
                        isEdit ? "Leave blank to keep current password" : ""
                    }
                    className="w-full rounded-md border border-black px-3 py-2 text-black"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-black">
                    Roles
                </label>

                {roles.map((role) => (
                    <label
                        key={role.id}
                        className="flex items-center gap-2 text-black"
                    >
                        <input
                            type="checkbox"
                            value={role.id}
                            {...register("roleIds")}
                        />

                        {role.name}
                    </label>
                ))}
            </div>

            {isEdit && (
                <label className="flex items-center gap-2 text-black">
                    <input
                        type="checkbox"
                        {...register("isActive")}
                    />

                    Active
                </label>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="hidden"
            >
                Submit
            </button>
        </form>
    );
}