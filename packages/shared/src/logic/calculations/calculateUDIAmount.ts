type CalculateUDIAmountParams = {
    principalAmount: number;
    rate: number;
    terms: number;
};

export function calculateUDIAmount({
    principalAmount,
    rate,
    terms,
}: CalculateUDIAmountParams): number {
    const totalRate = rate * terms;
    const udi = principalAmount * (totalRate / 100);

    return Math.round(udi * 100) / 100;
}