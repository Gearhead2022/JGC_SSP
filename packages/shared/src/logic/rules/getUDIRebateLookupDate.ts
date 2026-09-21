type UDIRebateLookupDateParams = {
    transactionDate: Date;
    cutOffDate: number;
};

export function getUDIRebateLookupDate({
    transactionDate,
    cutOffDate,
}: UDIRebateLookupDateParams): Date {
    const monthOffset =
        transactionDate.getDate() <= cutOffDate
            ? -1
            : 0;

    return new Date(
        transactionDate.getFullYear(),
        transactionDate.getMonth() + monthOffset,
        1
    );
}