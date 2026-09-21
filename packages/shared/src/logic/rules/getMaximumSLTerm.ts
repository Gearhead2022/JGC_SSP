import { getAge } from "../../utils/get-age";
import {
    MAX_NEW_SL_TERM_SL_1,
    MAX_NEW_SL_TERM_SL_2,
    MAX_SL_TERM_SL_1,
    MAX_SL_TERM_SL_2,
    MAX_SL_TERM_SL_3,
    NEW_SL_AGE_SPAN_1,
    NEW_SL_AGE_SPAN_2,
    SL_AGE_SPAN_1,
    SL_AGE_SPAN_2,
    SL_AGE_SPAN_3,
} from "../../constants/SSP/loan.constants";

import { TRANSACTION_TYPES, type TransactionType } from "@repo/shared";

type SLTermParams = {
    transactionType: TransactionType;
    birthDate: string | Date | null;
};

export function getMaximumSLTerm({
    transactionType,
    birthDate,
}: SLTermParams): number {

    if (!birthDate) {
        return 0;
    }

    const age = getAge(birthDate);

    if (age === null) {
        return 0;
    }

    if (transactionType === TRANSACTION_TYPES.new) {
        if (age >= NEW_SL_AGE_SPAN_1.minAge && age <= NEW_SL_AGE_SPAN_1.maxAge) {
            return MAX_NEW_SL_TERM_SL_1;
        }

        if (age >= NEW_SL_AGE_SPAN_2.minAge && age <= NEW_SL_AGE_SPAN_2.maxAge) {
            return MAX_NEW_SL_TERM_SL_2;
        }
    } else if (transactionType === TRANSACTION_TYPES.renew || transactionType === TRANSACTION_TYPES.returnee) {
        if (age >= SL_AGE_SPAN_1.minAge && age <= SL_AGE_SPAN_1.maxAge) {
            return MAX_SL_TERM_SL_1;
        }

        if (age >= SL_AGE_SPAN_2.minAge && age <= SL_AGE_SPAN_2.maxAge) {
            return MAX_SL_TERM_SL_2;
        }

        if (age >= SL_AGE_SPAN_3.minAge && age <= SL_AGE_SPAN_3.maxAge) {
            return MAX_SL_TERM_SL_3;
        }
    }

    return 0;
}