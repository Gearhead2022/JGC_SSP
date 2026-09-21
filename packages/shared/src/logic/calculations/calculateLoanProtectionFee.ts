type CalculateLoanProtectionFeeParams = {
    terms: number;
    amountFee: number;
};

export function calculateLoanProtectionFee({
    terms,
    amountFee,
}: CalculateLoanProtectionFeeParams): number {
    return terms > 3 ? amountFee : 0;
}