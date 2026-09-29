import { CollectionStatus, LoanStatus } from "../../../../generated/prisma/client";

export type CreateLoanCollectionData = {
    computationSlipId: string;
    collectionDate: Date;
    amount: number;
    beginningBalance: number;
    endingBalance: number;
    remarks?: string;
    status: CollectionStatus;
};