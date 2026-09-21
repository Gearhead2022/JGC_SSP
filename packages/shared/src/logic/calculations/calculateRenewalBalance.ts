type CalculateSourceLoanBalanceParams = {
    remainingBalance: number;
    installment: number;
    nextCollectionDate: Date;
    newEffectivityDate: Date;
};

type SourceLoanBalanceResult = {
    projectedBalance: number;
    collectionCount: number;
};

export function calculateSourceLoanBalance({
    remainingBalance,
    installment,
    nextCollectionDate,
    newEffectivityDate,
}: CalculateSourceLoanBalanceParams): SourceLoanBalanceResult {
    if (
        remainingBalance <= 0 ||
        installment <= 0 ||
        Number.isNaN(nextCollectionDate.getTime()) ||
        Number.isNaN(newEffectivityDate.getTime())
    ) {
        return {
            projectedBalance: Math.max(0, remainingBalance),
            collectionCount: 0,
        };
    }

    const nextCollectionMonth = new Date(
        nextCollectionDate.getFullYear(),
        nextCollectionDate.getMonth(),
        1
    );

    const effectivityMonth = new Date(
        newEffectivityDate.getFullYear(),
        newEffectivityDate.getMonth(),
        1
    );

    const monthDifference =
        (effectivityMonth.getFullYear() -
            nextCollectionMonth.getFullYear()) *
        12 +
        (effectivityMonth.getMonth() -
            nextCollectionMonth.getMonth());

    // Effectivity month itself belongs to the NEW loan,
    // so only months before it belong to the source loan.
    const collectionCount =
        Math.max(0, monthDifference);

    const projectedBalance = Math.max(
        0,
        remainingBalance -
        installment * collectionCount
    );

    return {
        projectedBalance:
            Math.round(projectedBalance * 100) / 100,

        collectionCount,
    };
}