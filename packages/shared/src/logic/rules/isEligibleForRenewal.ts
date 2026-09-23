import {
    LOAN_STATUS_TYPES,
    TRANSACTION_TYPES,
    MINIMUM_PAID_TERMS_FOR_RENEWAL
} from "../../constants/index";

type IsEligibleForRenewalParams = {
    loanStatus: string;
    paidTerms: number;
    terms: number;
    remainingBalance: number;
    transactionType?: string;
};

type RenewalEligibilityResult = {
    eligible: boolean;
    reason?: string;
};

export function isEligibleForRenewal({
    loanStatus,
    paidTerms,
    terms,
    remainingBalance,
    transactionType
}: IsEligibleForRenewalParams): RenewalEligibilityResult {
    if (transactionType === TRANSACTION_TYPES.renew) {
        if (loanStatus !== LOAN_STATUS_TYPES.active) {
            return {
                eligible: false,
                reason: "Only active loan accounts can be renewed.",
            };
        }

        if (paidTerms < MINIMUM_PAID_TERMS_FOR_RENEWAL) {
            return {
                eligible: false,
                reason: `Loan must have at least ${MINIMUM_PAID_TERMS_FOR_RENEWAL} paid terms before renewal.`,
            };
        }

        if (remainingBalance <= 0) {
            return {
                eligible: false,
                reason: "Fully paid loans cannot be renewed.",
            };
        }

        if (paidTerms >= terms) {
            return {
                eligible: false,
                reason: "Loan has already completed its terms.",
            };
        }

    } else if (transactionType === TRANSACTION_TYPES.returnee) {

        if (terms <= 0) {
            return {
                eligible: false,
                reason: "Invalid loan terms.",
            };
        }

        // check if has active account
        // check 


    } else {

        if (terms <= 0) {
            return {
                eligible: false,
                reason: "Invalid loan terms.",
            };
        }

    }

    return {
        eligible: true,
    };
}