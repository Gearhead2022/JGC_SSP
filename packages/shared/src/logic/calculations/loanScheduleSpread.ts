type LoanScheduleItem = {
    date: Date;
    beginning: number;
    amount: number;
    balance: number;
};

type GenerateLoanScheduleParams = {
    effectivityDate: Date;
    installment: number;
    terms: number;
    principalAmount: number;
};

export function generateLoanSchedule({
    effectivityDate,
    installment,
    terms,
    principalAmount,
}: GenerateLoanScheduleParams): LoanScheduleItem[] {
    const schedule: LoanScheduleItem[] = [];

    let balance = principalAmount;
    let beginning = 0;

    for (let index = 0; index < terms; index++) {
        const paymentDate = new Date(
            effectivityDate.getFullYear(),
            effectivityDate.getMonth() + index,
            1
        );

        beginning = balance;

        const amount = Math.min(installment, balance);

        balance = Math.max(0, balance - amount);

        schedule.push({
            date: paymentDate,
            beginning,
            amount,
            balance,
        });
    }

    return schedule;
}