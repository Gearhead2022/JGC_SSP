import { z } from "zod";
import {
    LOAN_STATUS_TYPES,
    TRANSACTION_TYPES,
} from "../../../constants";

export const sourceCollectionSchema =
    z.object({
        computationSlipId: z
            .string()
            .uuid(),

        collectionDate: z
            .string()
            .min(1),

        amount: z
            .number()
            .positive(),
    });

export const computationSlipInputSchema =
    z.object({
        pensionerId: z
            .string()
            .uuid(
                "Invalid pensioner ID"
            ),

        branchName: z
            .string()
            .trim()
            .min(
                1,
                "Branch is required"
            ),

        accountNumber: z
            .string()
            .trim()
            .optional(),

        transactionDate: z
            .string()
            .min(
                1,
                "Transaction date is required"
            ),

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
            .positive(
                "Installment must be greater than 0"
            ),

        terms: z
            .number()
            .int()
            .positive(
                "Terms must be greater than 0"
            ),

        supplementary: z
            .number()
            .min(
                0,
                "Supplementary cannot be negative"
            ),

        supplementaryBalance: z
            .number()
            .min(
                0,
                "Supplementary balance cannot be negative"
            ),
        // supplementaryCharge: z
        //     .number()
        //     .min(
        //         0,
        //         "Supplementary charge cannot be negative"
        //     ),
        supplementaryChargeMonthsToPay: z
            .number()
            .int()
            .min(0),
        applySupplementaryCharge: z.boolean(),
    });

export const calculateComputationSlipSchema =
    computationSlipInputSchema
        .superRefine(
            (data, ctx) => {
                if (
                    data.transactionType ===
                    TRANSACTION_TYPES.renew &&
                    !data.accountNumber
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "accountNumber",
                        ],

                        message:
                            "Loan account number is required for renewal",
                    });
                }
            }
        );

export type CalculateComputationSlipSchema = z.infer<typeof calculateComputationSlipSchema>;

export const computationSlipCalculationResultSchema =
    computationSlipInputSchema.extend({
        effectivityDate: z
            .string()
            .min(1),

        principalAmount: z
            .number()
            .min(0),

        udi: z
            .number()
            .min(0),

        collectionFee: z
            .number()
            .min(0),

        processingFee: z
            .number()
            .min(0),

        loanProtectionFee: z
            .number()
            .min(0),

        icod: z
            .number()
            .min(0),

        udiRebate: z
            .number()
            .min(0),

        activeLoanBalance: z
            .number()
            .min(0),

        grossCashOut:
            z.number(),

        netCashOut:
            z.number(),

        totalCashOut:
            z.number(),

        renewedFromId: z
            .string()
            .uuid()
            .optional(),

        shouldCreateSourceCollection:
            z.boolean()
                .default(false),

        sourceCollectionCount:
            z.number()
                .int()
                .min(0)
                .default(0),

        sourceCollection:
            sourceCollectionSchema
                .optional(),
        supplementaryCharge:
            z.number()
                .min(0),
        supplementaryChargeMonthly:
            z.number()
                .min(0),
        supplementaryChargeAvailableMonths:
            z.number()
                .min(0),
        supplementaryChargeRemainingMonths:
            z.number()
                .min(0),
        supplementaryChargeToPay:
            z.number()
                .min(0),

    });

export type ComputationSlipCalculationResult = z.infer<typeof computationSlipCalculationResultSchema>;

export const createComputationSlipSchema =
    computationSlipCalculationResultSchema
        .extend({
            loanStatus: z.enum([
                LOAN_STATUS_TYPES.active,
                LOAN_STATUS_TYPES.renewed,
                LOAN_STATUS_TYPES.closed,
                LOAN_STATUS_TYPES.paid,
                LOAN_STATUS_TYPES.cancelled,
            ]),
        })
        .superRefine(
            (data, ctx) => {
                if (
                    data.transactionType ===
                    TRANSACTION_TYPES.renew &&
                    !data.accountNumber
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "accountNumber",
                        ],

                        message:
                            "Loan account number is required for renewal",
                    });
                }

                if (
                    data.transactionType ===
                    TRANSACTION_TYPES.renew &&
                    !data.renewedFromId
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "renewedFromId",
                        ],

                        message:
                            "Source loan is required for renewal",
                    });
                }
            }
        );

export type CreateComputationSlipSchema = z.infer<typeof createComputationSlipSchema>;