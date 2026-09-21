export function isMonthBefore(
    date: Date,
    comparisonDate: Date
): boolean {
    const dateMonth =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );

    const comparisonMonth =
        new Date(
            comparisonDate.getFullYear(),
            comparisonDate.getMonth(),
            1
        );

    return dateMonth < comparisonMonth;
}