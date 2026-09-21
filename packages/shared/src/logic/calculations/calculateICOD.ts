import {
    ICOD_MONTH_COUNT_EXPIRY,
    TRANSACTION_TYPES,
    type TransactionType,
} from "@repo/shared";

type CalculateICODParams = {
    transactionType: TransactionType;
    lr: number;
    sl: number;
    percentage: number;
    existingAmountFee: number;
    newMaximumFee: number;

    originalTransactionDate?: Date;
    renewalTransactionDate?: Date;
};

export function calculateICOD({
    transactionType,
    lr,
    sl,
    percentage,
    existingAmountFee,
    newMaximumFee,
    originalTransactionDate,
    renewalTransactionDate,
}: CalculateICODParams): number {
    let icodAmount = 0;

    if (transactionType === TRANSACTION_TYPES.new) {
        icodAmount =
            (lr + sl) * (percentage / 100);

        icodAmount = Math.min(
            icodAmount,
            newMaximumFee
        );
    }

    if (transactionType === TRANSACTION_TYPES.renew) {
        if (
            !originalTransactionDate ||
            !renewalTransactionDate
        ) {
            throw new Error(
                "Original and renewal transaction dates are required for ICOD renewal calculation"
            );
        }

        const monthDifference =
            (renewalTransactionDate.getFullYear() -
                originalTransactionDate.getFullYear()) *
            12 +
            (renewalTransactionDate.getMonth() -
                originalTransactionDate.getMonth());

        icodAmount =
            monthDifference <= ICOD_MONTH_COUNT_EXPIRY
                ? 0
                : existingAmountFee;
    }

    return Math.round(icodAmount);
}