export function isMonthBefore(
    date: Date,
    comparisonDate: Date
): boolean {
    const sourceMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );

    const targetMonth = new Date(
        comparisonDate.getFullYear(),
        comparisonDate.getMonth(),
        1
    );

    return sourceMonth < targetMonth;
}