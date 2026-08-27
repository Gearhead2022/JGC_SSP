import z from "zod";

export const registerUserSchema = z.object({
    email: z.string().email().optional(),
    name: z.string().min(1),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    isActive: z.boolean().optional(),
})

export type RegisterUserSchema = z.infer<typeof registerUserSchema>

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;


