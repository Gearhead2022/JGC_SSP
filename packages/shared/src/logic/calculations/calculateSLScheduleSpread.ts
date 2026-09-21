type SupplementaryLoanScheduleItem = {
    date: Date;
    beginningBalance: number;
    paymentAmount: number;
    balance: number;
    supplementaryCharge: number;
};

type GenerateSupplementaryLoanScheduleParams = {
    effectivityDate: Date;
    installment: number;
    supplementaryAmount: number;
    supplementaryRate: number;
};

export function generateSupplementaryLoanSchedule({
    effectivityDate,
    installment,
    supplementaryAmount,
    supplementaryRate,
}: GenerateSupplementaryLoanScheduleParams): SupplementaryLoanScheduleItem[] {
    const schedule: SupplementaryLoanScheduleItem[] = [];

    if (
        installment <= 0 ||
        supplementaryAmount <= 0 ||
        supplementaryRate < 0
    ) {
        return schedule;
    }

    let balance = supplementaryAmount;

    const supplementaryTerms = Math.ceil(
        supplementaryAmount / installment
    );

    for (let index = 0; index <= supplementaryTerms; index++) {
        if (balance === 0) {
            break;
        }

        const paymentDate = new Date(
            effectivityDate.getFullYear(),
            effectivityDate.getMonth() + index,
            1
        );

        const beginningBalance = balance;

        const supplementaryCharge =
            balance * (supplementaryRate / 100);

        const paymentAmount = Math.min(
            installment,
            balance
        );

        balance =
            balance - paymentAmount;

        schedule.push({
            date: paymentDate,
            beginningBalance: roundMoney(beginningBalance),
            paymentAmount: roundMoney(paymentAmount),
            balance: roundMoney(balance),
            supplementaryCharge: roundMoney(
                supplementaryCharge
            ),
        });
    }

    return schedule;
}

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}