import { Prisma, PrismaClient } from "../../../../generated/prisma/client";

export type DbClient =
    PrismaClient |
    Prisma.TransactionClient;

export type CloseSourceLoanData = {
    computationSlipId: string;
    closingBalance: number;
    loanStatus:
    | "RENEWED"
    | "CLOSED";
};
export type CreateComputationSlipData = {
    pensionerId: string;
    branchName: string;

    transactionDate: Date;
    effectivityDate: Date;

    transactionType: string;

    installment: number;
    terms: number;
    supplementary: number;
    supplementaryBalance: number;

    principalAmount: number;

    udi: number;
    collectionFee: number;
    processingFee: number;
    loanProtectionFee: number;
    icod: number;

    grossCashOut: number;
    netCashOut: number;
    totalCashOut: number;

    renewedFromId?: string;

    loanStatus:
    | "ACTIVE"
    | "RENEWED"
    | "CLOSED"
    | "PAID"
    | "CANCELLED";
};

export type CreatePendingCollectionData = {
    computationSlipId: string;

    collectionDate: Date;

    amount: number;

    beginningBalance: number;

    endingBalance: number;

    remarks?: string;
};