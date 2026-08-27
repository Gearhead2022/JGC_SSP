import { z } from "zod";
import { registerUserSchema } from "../../authentication/user.schema";

export const createUserSchema =
    registerUserSchema.extend({
        roleIds: z
            .array(
                z.coerce.number().int().positive()
            )
            .min(1, "At least one role is required"),
    });

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
    .omit({
        password: true,
    })
    .partial()
    .extend({
        roleIds: z
            .array(z.coerce.number().int().positive())
            .optional(),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .or(z.literal(""))
            .optional(),
    });


export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
