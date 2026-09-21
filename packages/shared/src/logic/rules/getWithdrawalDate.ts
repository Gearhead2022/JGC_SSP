type WithdrawalDateParams = {
    date: Date;
    bank: string;
};

export function getWithDrawalDate({
    date,
    bank,
}: WithdrawalDateParams): number {
    const day = date.getDate();
    let withdrawalDate;

    if (bank === 'SSS') {
        withdrawalDate = day <= 15 ? 1 : 16;
    } else {
        withdrawalDate = 8;
    }

    return withdrawalDate;
}