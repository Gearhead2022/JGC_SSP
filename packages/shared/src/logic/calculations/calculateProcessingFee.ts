import { TRANSACTION_TYPES, ProcessingFeeConfig, type TransactionType, AGE_THRESHOLD_FOR_ADDITIONAL, ADDITIONAL_FEE_FOR_NEW_ACCOUNT } from "@repo/shared";

type CalculateProcessingFeeParams = {
    transactionType: TransactionType;
    terms: number;
    fees: ProcessingFeeConfig;
    age: number;
};

export function calculateProcessingFee({
    transactionType,
    terms,
    fees,
    age
}: CalculateProcessingFeeParams): number {
    let processingFee = 0;

    if (transactionType === TRANSACTION_TYPES.new) {
        if (terms <= 5) {
            processingFee = fees.new.upToFiveMonths;
        } else {
            processingFee = fees.new.aboveFiveMonths;
        }
    } else {
        if (terms <= 3) {
            processingFee = fees.existing.upToThreeMonths;
        } else if (terms <= 5) {
            processingFee = fees.existing.fourToFiveMonths;
        } else if (terms <= 7) {
            processingFee = fees.existing.sixToSevenMonths;
        } else if (terms === 8) {
            processingFee = fees.existing.eightMonths;
        } else if (terms === 9) {
            processingFee = fees.existing.nineMonths;
        } else if (terms <= 12) {
            processingFee = fees.existing.tenToTwelveMonths;
        }
    }

    const totalProcessingFee = age >= AGE_THRESHOLD_FOR_ADDITIONAL ? processingFee + ADDITIONAL_FEE_FOR_NEW_ACCOUNT : processingFee;

    return Math.round(totalProcessingFee);
}