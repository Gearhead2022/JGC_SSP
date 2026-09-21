// export function formatCurrency(
//     amount: number,
//     locale = "en-PH",
//     currency = "PHP"
// ) {
//     return new Intl.NumberFormat(locale, {
//         style: "currency",
//         currency,
//     }).format(amount);
// }


export function formatNumber(
    amount: number,
    locale = "en-PH"
): string {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}