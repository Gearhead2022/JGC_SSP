import { getUDIRebateEffectivityDate } from "../rules/getUDIEffectivityDate";
import { getUDIRebateLookupDate } from "../rules/getUDIRebateLookupDate";

type CalculateUDIRebateParams = {
    originalTransactionDate: Date;
    renewalTransactionDate: Date;
    udi: number;
    terms: number;
    cutOffDate: number;
};

export function calculateUDIRebateAmount({
    originalTransactionDate,
    renewalTransactionDate,
    udi,
    terms,
    cutOffDate,
}: CalculateUDIRebateParams): number {
    if (udi <= 0 || terms <= 0) {
        return 0;
    }

    const scheduleStartDate =
        getUDIRebateEffectivityDate({
            transactionDate: originalTransactionDate,
            cutOffDate,
        });

    const rebateLookupDate =
        getUDIRebateLookupDate({
            transactionDate: renewalTransactionDate,
            cutOffDate,
        });

    let monthIndex =
        (rebateLookupDate.getFullYear() - scheduleStartDate.getFullYear()) * 12 +
        (rebateLookupDate.getMonth() - scheduleStartDate.getMonth());

    // Transaction day
    const transactionDay = renewalTransactionDate.getDate();

    // Before cutoff → use previous month's unearned amount
    // if (transactionDay < cutOffDate) {
    //     monthIndex -= 1;
    // }

    if (monthIndex < 0 || monthIndex >= terms) {
        return 0;
    }

    const sumOfDigits =
        (terms * (terms + 1)) / 2;

    const udiPerWeight =
        udi / sumOfDigits;

    const currentWeight = terms - monthIndex;

    // Sum all weights from the first month up to the current month
    const earnedWeight =
        (monthIndex + 1) * (terms + currentWeight) / 2;

    const rebate =
        udiPerWeight * earnedWeight;

    const udiUnearnedAmount =
        udi - rebate;

    return Math.round(udiUnearnedAmount * 100) / 100;
}