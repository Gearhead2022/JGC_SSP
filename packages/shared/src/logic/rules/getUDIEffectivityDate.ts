type UDIRebateEffectivityParams = {
    transactionDate: Date;
    cutOffDate: number;
};

export function getUDIRebateEffectivityDate({
    transactionDate,
    cutOffDate,
}: UDIRebateEffectivityParams): Date {
    const monthOffset = transactionDate.getDate() <= cutOffDate ? 0 : 1;

    return new Date(transactionDate.getFullYear(), transactionDate.getMonth() + monthOffset, 1);
}