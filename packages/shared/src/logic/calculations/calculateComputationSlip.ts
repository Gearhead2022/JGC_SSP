import { COLLECTION_FEE, CUT_OFF_DATE_FOR_EFFECTIVITY, CUT_OFF_DATE_UDI, ICOD, LOAN_PROTECTION_FEE, PROCESSING_FEE, TRANSACTION_TYPES, UDI_RATE } from "../../constants";
import { ComputationSlipCalculationInput } from "../../types";
import { isMonthBefore } from "../../utils";
import { calculateLoanEffectivityDate } from "../rules/getLoanEffectivityDate";
import { calculateCollectionFee } from "./calculateCollectionFee";
import { calculateICOD } from "./calculateICOD";
import { calculateLoanProtectionFee } from "./calculateLoanProtectionFee";
import { calculateNetCashOut } from "./calculateNetCashOut";
import { calculateProcessingFee } from "./calculateProcessingFee";
import { calculateSourceLoanBalance } from "./calculateRenewalBalance";
import { calculateUDIAmount } from "./calculateUDIAmount";
import { calculateUDIRebateAmount } from "./calculateUDIRebateAmount";

export function calculateComputationSlip(
    input: ComputationSlipCalculationInput
) {
    const {
        transactionType,
        age,
        installment,
        terms,
        supplementary,
        transactionDate,
        activeLoan,
    } = input;

    const isRenew = transactionType === TRANSACTION_TYPES.renew;

    const paidTermsBeforeRenewal =
        isRenew
            ? activeLoan?.paidTerms ?? 0
            : 0;//

    const applicableCollectionTerms =
        isRenew
            ? paidTermsBeforeRenewal
            : terms;//

    const principalAmount = installment * terms;//

    const udi =
        calculateUDIAmount({
            principalAmount,
            rate: UDI_RATE,
            terms,
        });//

    const processingFee =
        calculateProcessingFee({
            transactionType,
            terms: applicableCollectionTerms,
            fees: PROCESSING_FEE,
            age,
        });//

    const collectionFee =
        calculateCollectionFee({
            transactionType,
            amountFee: COLLECTION_FEE,
            terms: applicableCollectionTerms,
        });//

    const loanProtectionFee =
        calculateLoanProtectionFee({
            terms,
            amountFee: LOAN_PROTECTION_FEE,
        });

    const effectivityDate =
        calculateLoanEffectivityDate({
            date: transactionDate,
            cutOffDate: CUT_OFF_DATE_FOR_EFFECTIVITY,
        });

    const sourceLoanBalance =
        transactionType === TRANSACTION_TYPES.renew && activeLoan && effectivityDate
            ? calculateSourceLoanBalance({
                remainingBalance: Number(activeLoan.remainingBalance),
                installment: Number(activeLoan.installment),
                nextCollectionDate: new Date(activeLoan.nextCollectionDate),
                newEffectivityDate: effectivityDate,
            })
            : {
                projectedBalance: 0,
                collectionCount: 0,
            };

    const shouldCreateSourceCollection =
        isRenew && activeLoan && effectivityDate
            ? isMonthBefore(
                activeLoan.nextCollectionDate,
                effectivityDate
            )
            : false;

    const activeLoanBalance =
        isRenew && activeLoan
            ? shouldCreateSourceCollection
                ? sourceLoanBalance?.projectedBalance ?? 0
                : activeLoan.remainingBalance
            : 0;

    const udiRebate =
        isRenew && activeLoan
            ? calculateUDIRebateAmount({
                originalTransactionDate: activeLoan.transactionDate,
                renewalTransactionDate: transactionDate,
                udi: activeLoan.udi,
                terms: activeLoan.terms,
                cutOffDate: CUT_OFF_DATE_UDI,
            })
            : 0;

    const icod =
        calculateICOD({
            transactionType,
            lr: principalAmount,
            sl: supplementary,
            percentage: ICOD.percentage,
            existingAmountFee: ICOD.existingAmountFee,
            newMaximumFee: ICOD.newMaximumFee,
            originalTransactionDate: activeLoan?.transactionDate,
            renewalTransactionDate: transactionDate,
        });

    const cashOut =
        calculateNetCashOut({
            transactionType,
            principalAmount,
            udi,
            collectionFee,
            processingFee,
            loanProtectionFee,
            icod,
            supplementary,
            activeLoanBalance,
            udiRebate,
        });

    return {
        principalAmount,
        udi,
        processingFee,
        collectionFee,
        loanProtectionFee,
        icod,
        udiRebate,
        effectivityDate,
        sourceLoanBalance,
        shouldCreateSourceCollection,
        activeLoanBalance,
        grossCashOut: cashOut.grossCashout,
        netCashOut: cashOut.netCashOut,
        totalCashOut: cashOut.totalCashOut,
    };
}