import { getUDIRebateEffectivityDate } from "../rules/getUDIEffectivityDate";

type UDIRebateScheduleItem = {
    date: Date;
    udiEarnedAmount: number;
    udiAmount: number;
};

type GenerateUDIRebateScheduleParams = {
    transactionDate: Date;
    udi: number;
    terms: number;
    cutOffDate: number;
};

export function generateUDIRebateSchedule({
    transactionDate,
    udi,
    terms,
    cutOffDate,
}: GenerateUDIRebateScheduleParams): UDIRebateScheduleItem[] {
    const schedule: UDIRebateScheduleItem[] = [];

    if (terms <= 0 || udi <= 0) {
        return schedule;
    }

    const sumOfDigits = (terms * (terms + 1)) / 2;
    const udiPerWeight = udi / sumOfDigits;

    let newUdi = udi;

    const rebateEffectivityDate =
        getUDIRebateEffectivityDate({
            transactionDate,
            cutOffDate,
        });

    for (let index = 0; index < terms; index++) {
        const rebateDate = new Date(
            rebateEffectivityDate.getFullYear(),
            rebateEffectivityDate.getMonth() + index,
            1
        );

        const weight = terms - index;

        const udiEarnedAmount =
            udiPerWeight * weight;

        const udiUnearnedAmount =
            newUdi - udiEarnedAmount;

        newUdi =
            Math.round(udiUnearnedAmount * 100) / 100;

        schedule.push({
            date: rebateDate,
            udiEarnedAmount:
                Math.round(udiEarnedAmount * 100) / 100,
            udiAmount: newUdi,
        });
    }

    return schedule;
}