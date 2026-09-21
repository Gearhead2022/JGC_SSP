export * from "./get-age";
export * from "./format-date-api";
export * from "./isMonthBefore";

export function formatCurrency(
    amount: number,
    locale = "en-PH",
    currency = "PHP"
) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}