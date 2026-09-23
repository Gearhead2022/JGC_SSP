import { TRANSACTION_TYPES, type TransactionType } from "@repo/shared";

type CashOutItem = {
    grossCashout: number;
    netCashOut: number;
    totalCashOut: number;
};

type CalculateNetCashOutParams = {
    transactionType: TransactionType;
    principalAmount: number;
    udi?: number;
    collectionFee?: number;
    processingFee?: number;
    loanProtectionFee?: number;
    icod?: number;
    supplementary?: number;
    activeLoanBalance?: number;
    udiRebate?: number;
    supplementaryCharge?: number;
};

export function calculateNetCashOut({
    transactionType,
    principalAmount,
    udi = 0,
    collectionFee = 0,
    processingFee = 0,
    loanProtectionFee = 0,
    icod = 0,
    supplementary = 0,
    activeLoanBalance = 0,
    udiRebate = 0,
    supplementaryCharge = 0,
}: CalculateNetCashOutParams): CashOutItem {
    const grossCashout =
        principalAmount -
        udi;
    const netCashOut =
        principalAmount -
        udi -
        collectionFee -
        processingFee -
        loanProtectionFee -
        icod;
    const total = netCashOut + supplementary;

    const totalCashOut =
        transactionType === TRANSACTION_TYPES.renew
            ? total + udiRebate - activeLoanBalance - supplementaryCharge
            : total + udiRebate - supplementaryCharge;

    return {
        grossCashout: roundMoney(grossCashout),
        netCashOut: roundMoney(netCashOut),
        totalCashOut: roundMoney(totalCashOut)
    };
}

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}