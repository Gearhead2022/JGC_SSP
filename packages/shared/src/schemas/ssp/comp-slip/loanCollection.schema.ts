import { z } from "zod";

export const createLoanCollectionSchema = z.object({
    computationSlipId: z
        .string()
        .uuid("Invalid computation slip ID"),

    collectionDate: z
        .string()
        .min(1, "Collection date is required"),

    amount: z
        .number()
        .positive("Collection amount must be greater than 0"),

    remarks: z
        .string()
        .trim()
        .max(255)
        .optional(),
});

export type CreateLoanCollectionSchema =
    z.infer<typeof createLoanCollectionSchema>;