import { LoanStatusType, TransactionType } from "../../constants";


export type Pensioner = {
    id: string;
    legacyPensionerId: number;
    pensionerId: number;
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string;
    actualPension: string;
    contingencyDate: string;
    bankName: string;
};


export type ProcessingFeeConfig = {
    new: {
        upToFiveMonths: number;
        aboveFiveMonths: number;
    };

    existing: {
        upToThreeMonths: number;
        fourToFiveMonths: number;
        sixToSevenMonths: number;
        eightMonths: number;
        nineMonths: number;
        tenToTwelveMonths: number;
    };
};

export type ActiveLoan = {
    id: string;
    pensionerId: string;
    effectivityDate: string;
    installment: number;
    terms: number;
    principalAmount: number;
    remainingBalance: number;
    nextCollectionDate: string;
};

export type ActiveLoanCollection = {
    computationSlipId: string;
    accountNumber: string;

    pensioner: Pensioner;

    effectivityDate: string;

    transactionDate: string;

    installment: number;
    principalAmount: number;

    udi: number;

    terms: number;
    paidTerms: number;

    remainingBalance: number;

    nextCollectionDate: string;

    loanStatus: LoanStatusType;

    supplementaryBalance: number;
};

export type CreateLoanCollectionPayload = {
    computationSlipId: string;
    pensionerId: string;
    collectionDate: string;
    amount: number;
    remarks?: string;
};

export type LoanCollection = {
    id: string;
    computationSlipId: string;
    collectionDate: string;
    amount: number;
    beginningBalance: number;
    endingBalance: number;
    remarks?: string | null;
    createdAt: string;
    updatedAt: string;
};


export type LoanCollectionHistoryItem = {
    id: string;
    collectionDate: string;
    amount: number;
    beginningBalance: number;
    endingBalance: number;
    status: "PENDING" | "POSTED";
    remarks?: string | null;
    createdAt: string;
};

export type CompslipListItem = {
    id: string;

    counterNumber: number;
    controlNumber: string;
    accountNumber: string;
    branchName: string;

    pensionerId: string;

    transactionDate: string;
    effectivityDate: string;

    transactionType: TransactionType;

    installment: number | string;
    terms: number;
    supplementary: number | string;
    supplementaryBalance: number | string;

    principalAmount: number | string;

    udi: number | string;
    collectionFee: number | string;
    processingFee: number | string;
    loanProtectionFee: number | string;
    icod: number | string;

    grossCashOut: number | string;
    netCashOut: number | string;
    totalCashOut: number | string;

    createdAt: string;
    updatedAt: string;

    pensioner: Pensioner;

    status: "ACTIVE" | "CLOSED" | "RENEWED" | "PAID" | "CANCELLED"
};


export type ComputationSlipCalculationInput = {
    transactionType: TransactionType;

    age: number;

    installment: number;
    terms: number;
    supplementary: number;

    transactionDate: Date;

    activeLoan?: {
        installment: number;
        terms: number;
        paidTerms: number;
        remainingBalance: number;
        udi: number;

        transactionDate: Date;
        nextCollectionDate: Date;
    };
};