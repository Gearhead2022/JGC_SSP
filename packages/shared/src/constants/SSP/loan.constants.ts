import { ProcessingFeeConfig } from "../../types";

export const TRANSACTION_TYPES = {
    new: "new",
    renew: "renew",
    transfer: "transfer",
    change: "change",
    returnee: "returnee",
    additional: "additional",
} as const;

export type TransactionType =
    typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export const PROCESSING_FEE: ProcessingFeeConfig = {
    new: {
        upToFiveMonths: 1880,
        aboveFiveMonths: 1780,
    },

    existing: {
        upToThreeMonths: 130,
        fourToFiveMonths: 280,
        sixToSevenMonths: 380,
        eightMonths: 430,
        nineMonths: 530,
        tenToTwelveMonths: 580,
    },
};

export const AGE_THRESHOLD_FOR_ADDITIONAL = 71;

export const ADDITIONAL_FEE_FOR_NEW_ACCOUNT = 500;

export const UDI_RATE = 2.75;

export const COLLECTION_FEE = 60;

export const ICOD = {
    percentage: 5,
    existingAmountFee: 1500,
    newMaximumFee: 3000,
} as const;

export const LOAN_PROTECTION_FEE = 150;

export const CUT_OFF_DATE_FOR_EFFECTIVITY = 14;

export const CUT_OFF_DATE_UDI = 14;

export const SL_RATE = 1.5;

export const ICOD_MONTH_COUNT_EXPIRY = 12;

// maxSLTerm

/// new

export const NEW_SL_AGE_SPAN_1 = {
    minAge: 60,
    maxAge: 70
}
export const NEW_SL_AGE_SPAN_2 = {
    minAge: 71,
    maxAge: 73
}
export const NEW_SL_AGE_SPAN_3 = {
    minAge: 74,
    maxAge: 75
}
export const NEW_SL_AGE_SPAN_4 = {
    minAge: 76,
    maxAge: 78
}

export const MAX_NEW_SL_TERM_SL_1 = 10;
export const MAX_NEW_SL_TERM_SL_2 = 2;

/// existing

export const SL_AGE_SPAN_1 = {
    minAge: 60,
    maxAge: 70
}
export const SL_AGE_SPAN_2 = {
    minAge: 71,
    maxAge: 73
}
export const SL_AGE_SPAN_3 = {
    minAge: 74,
    maxAge: 75
}
export const SL_AGE_SPAN_4 = {
    minAge: 76,
    maxAge: 77
}
export const SL_AGE_SPAN_5 = {
    minAge: 78,
    maxAge: 120
}

export const MAX_SL_TERM_SL_1 = 10;
export const MAX_SL_TERM_SL_2 = 7;
export const MAX_SL_TERM_SL_3 = 4;

// maxLRTerm

/// new

export const NEW_LR_AGE_SPAN_1 = {
    minAge: 69,
    maxAge: 70
}
export const NEW_LR_AGE_SPAN_2 = {
    minAge: 71,
    maxAge: 73
}
export const NEW_LR_AGE_SPAN_3 = {
    minAge: 74,
    maxAge: 75
}
export const NEW_LR_AGE_SPAN_4 = {
    minAge: 76,
    maxAge: 78
}

export const MAX_NEW_LR_TERM_SL_1 = 12;
export const MAX_NEW_LR_TERM_SL_2 = 8;
export const MAX_NEW_LR_TERM_SL_3 = 3;

/// existing

export const LR_AGE_SPAN_1 = {
    minAge: 69,
    maxAge: 70
}
export const LR_AGE_SPAN_2 = {
    minAge: 71,
    maxAge: 73
}
export const LR_AGE_SPAN_3 = {
    minAge: 74,
    maxAge: 75
}
export const LR_AGE_SPAN_4 = {
    minAge: 76,
    maxAge: 77
}
export const LR_AGE_SPAN_5 = {
    minAge: 78,
    maxAge: 120
}

export const MAX_LR_TERM_SL_1 = 12;
export const MAX_LR_TERM_SL_2 = 10;

export const LOAN_STATUS_TYPES = {
    active: "ACTIVE",
    renewed: "ACTIVE",
    closed: "CLOSED",
    paid: "PAID",
    cancelled: "CANCELLED"
} as const;

export type LoanStatusType =
    typeof LOAN_STATUS_TYPES[keyof typeof LOAN_STATUS_TYPES];

export const MINIMUM_PAID_TERMS_FOR_RENEWAL = 1;