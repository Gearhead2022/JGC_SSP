type EffectivityParams = {
    date: Date;
    cutOffDate: number;
};

export function calculateLoanEffectivityDate({
    date,
    cutOffDate,
}: EffectivityParams): Date {
    const day = date.getDate();

    const monthsToAdd = day > cutOffDate ? 2 : 1;

    return new Date(date.getFullYear(), date.getMonth() + monthsToAdd, 1);
}