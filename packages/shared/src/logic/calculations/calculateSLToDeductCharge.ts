type CalculateSupplementaryChargeParams = {
    startDate: Date;
    transactionDate: Date;
    supplementaryBalance: number;
    supplementaryRate: number;
    monthsToPay: number;
};

type SupplementaryChargeResult = {
    availableMonths: number;
    monthsToPay: number;
    remainingMonths: number;
    monthlyCharge: number;
    totalCharge: number;
};

export function calculateSupplementaryCharge({
    startDate,
    transactionDate,
    supplementaryBalance,
    supplementaryRate,
    monthsToPay,
}: CalculateSupplementaryChargeParams): SupplementaryChargeResult {

    if (
        supplementaryBalance <= 0 ||
        supplementaryRate < 0 ||
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(transactionDate.getTime())
    ) {
        return {
            availableMonths: 0,
            monthsToPay: 0,
            remainingMonths: 0,
            monthlyCharge: 0,
            totalCharge: 0,
        };
    }

    const monthDifference =
        (
            transactionDate.getFullYear() -
            startDate.getFullYear()
        ) * 12 +
        (
            transactionDate.getMonth() -
            startDate.getMonth()
        );

    const availableMonths =
        Math.max(
            0,
            monthDifference
        );

    const actualMonthsToPay =
        Math.min(
            Math.max(0, monthsToPay),
            availableMonths
        );

    const remainingMonths =
        availableMonths -
        actualMonthsToPay;

    const monthlyCharge =
        supplementaryBalance *
        (supplementaryRate / 100);

    const totalCharge =
        monthlyCharge *
        actualMonthsToPay;

    return {
        availableMonths,

        monthsToPay:
            actualMonthsToPay,

        remainingMonths,

        monthlyCharge:
            roundMoney(monthlyCharge),

        totalCharge:
            roundMoney(totalCharge),
    };
}

function roundMoney(
    value: number
): number {
    return Math.round(value * 100) / 100;
}