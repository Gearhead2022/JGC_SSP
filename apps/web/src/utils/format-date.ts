export function formatDate(
    date: string | Date,
    locale = "en-PH"
) {
    return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export function formatDateForInput(
    date: Date | string | null | undefined
): string {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toISOString().split("T")[0];
}

export function formatMonthYear(
    date: Date | string | null | undefined,
    locale = "en-PH"
): string {
    if (!date) return "";

    const parsedDate = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleDateString(locale, {
        month: "short",
        year: "numeric",
    });
}