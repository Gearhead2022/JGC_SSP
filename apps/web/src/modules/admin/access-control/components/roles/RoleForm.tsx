"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoleSchema, updateRoleSchema, type CreateRoleSchema, type UpdateRoleSchema } from "@repo/shared";
import { RoleFormProps } from "../../types/access-control.types";

export function RoleForm({
    mode,
    role,
    isSubmitting = false,
    onCreate,
    onUpdate,
}: RoleFormProps) {
    const isEdit = mode === "edit";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateRoleSchema | UpdateRoleSchema>({
        resolver: zodResolver(
            isEdit ? updateRoleSchema : createRoleSchema
        ),

        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (isEdit && role) {
            reset({
                name: role.name,
                description: role.description ?? "",
            });

            return;
        }

        reset({
            name: "",
            description: "",
        });
    }, [isEdit, role, reset]);

    function submit(
        data: CreateRoleSchema | UpdateRoleSchema
    ) {
        if (isEdit) {
            onUpdate?.(data as UpdateRoleSchema);
            return;
        }

        onCreate?.(data as CreateRoleSchema);
    }

    return (
        <form
            id="role-form"
            onSubmit={handleSubmit(submit)}
            className="space-y-4"
        >
            <div>
                <label className="mb-1 block text-sm font-medium text-black">
                    Role Name
                </label>

                <input
                    {...register("name")}
                    className="w-full rounded-md border border-black px-3 py-2 text-black"
                    placeholder="e.g. ADMIN"
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {String(errors.name.message)}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-black">
                    Description
                </label>

                <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full rounded-md border border-black px-3 py-2 text-black"
                    placeholder="Optional description"
                />
            </div>

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