import { TRANSACTION_TYPES, type TransactionType } from "../../constants";

type CalculateCollectionFeeParams = {
    transactionType: TransactionType;
    amountFee: number;
    terms: number;
};

export function calculateCollectionFee({
    transactionType,
    amountFee,
    terms,
}: CalculateCollectionFeeParams): number {

    const collectionFee = transactionType === TRANSACTION_TYPES.change ? 0 : amountFee * terms;

    return Math.round(collectionFee);
}