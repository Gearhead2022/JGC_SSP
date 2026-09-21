import { z } from "zod";
import { TRANSACTION_TYPES } from "../../../constants";

/**
 * Values directly controlled by the computation form.
 */
export const computationSlipSchema = z.object({
    transactionDate: z
        .string()
        .min(1, "Transaction date is required"),

    transactionType: z.enum([
        TRANSACTION_TYPES.new,
        TRANSACTION_TYPES.renew,
        TRANSACTION_TYPES.transfer,
        TRANSACTION_TYPES.change,
        TRANSACTION_TYPES.returnee,
        TRANSACTION_TYPES.additional,
    ]),

    installment: z
        .number()
        .positive("Installment must be greater than 0"),

    terms: z
        .number()
        .int("Terms must be a whole number")
        .positive("Terms must be greater than 0"),

    supplementary: z
        .number()
        .min(0, "Supplementary cannot be negative"),
});

export type ComputationSlipSchema =
    z.infer<typeof computationSlipSchema>;


/**
 * Complete payload required when creating
 * a computation slip through the API.
 */
export const createComputationSlipSchema =
    computationSlipSchema.extend({
        pensionerId: z.string().uuid(),

        effectivityDate: z
            .string()
            .min(1),

        branchName: z
            .string()
            .trim()
            .min(1),

        accountNumber: z
            .string()
            .trim()
            .optional(),
    }).superRefine((data, ctx) => {
        if (
            data.transactionType === TRANSACTION_TYPES.renew &&
            !data.accountNumber
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["accountNumber"],
                message: "Loan account is required for renewal",
            });
        }
    });

export type CreateComputationSlipSchema =
    z.infer<typeof createComputationSlipSchema>;