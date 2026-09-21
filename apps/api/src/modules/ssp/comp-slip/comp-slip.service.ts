import {
    calculateUDIAmount, calculateProcessingFee, calculateCollectionFee, calculateICOD,
    calculateLoanProtectionFee, calculateNetCashOut,
    CreateComputationSlipSchema,
    dateStringToUtcDate,
    monthYearToUtcDate,
    getAge,
    TRANSACTION_TYPES,
    calculateUDIRebateAmount,
    CUT_OFF_DATE_UDI,
    formatDateApi,
    CreateLoanCollectionSchema,
    calculateSourceLoanBalance,
} from "@repo/shared";

import { COLLECTION_FEE, ICOD, LOAN_PROTECTION_FEE, PROCESSING_FEE, UDI_RATE, } from "@repo/shared";

import * as repository from "./comp-slip.repository";
import * as helper from "./comp-slip.helper";
import { getActiveLoanByPensionerIdAndAccountNo, createLoanCollection } from "../loan-collection/loan-collection.service";

export async function searchPensioners(search: string) {
    const normalizedSearch = search.trim();

    if (normalizedSearch.length < 2) {
        return [];
    }

    const pensioners = await repository.searchPensioners(normalizedSearch);

    return pensioners;

}

export async function createComputationSlip(
    data: CreateComputationSlipSchema
) {
    const pensioner = await repository.findPensionerById(data.pensionerId);

    if (!pensioner) {
        throw new Error("Pensioner not found");
    }

    const age = getAge(pensioner.birthDate);

    const requiresActiveLoan = data.transactionType === TRANSACTION_TYPES.renew;

    let activeLoan = null;

    if (requiresActiveLoan) {
        if (!data.accountNumber) {
            throw new Error(
                "Loan account number is required for renewal"
            );
        }

        activeLoan = await getActiveLoanByPensionerIdAndAccountNo(pensioner.id, data.accountNumber);
    }

    const paidTermsBeforeRenewal = activeLoan?.paidTerms ?? 0;

    const applicableCollectionTerms =
        requiresActiveLoan
            ? paidTermsBeforeRenewal
            : data.terms;

    const principalAmount = data.installment * data.terms;

    const udi = calculateUDIAmount({
        principalAmount,
        rate: UDI_RATE,
        terms: data.terms,
    });

    const processingFee =
        calculateProcessingFee({
            transactionType: data.transactionType,
            terms: applicableCollectionTerms,
            fees: PROCESSING_FEE,
            age: Number(age),
        });

    const collectionFee =
        calculateCollectionFee({
            transactionType: data.transactionType,
            amountFee: COLLECTION_FEE,
            terms: applicableCollectionTerms,
        });

    const loanProtectionFee =
        calculateLoanProtectionFee({
            terms: data.terms,
            amountFee: LOAN_PROTECTION_FEE,
        });

    const icod =
        calculateICOD({
            transactionType: data.transactionType,
            lr: principalAmount,

            sl: data.supplementary,

            percentage: ICOD.percentage,

            existingAmountFee:
                ICOD.existingAmountFee,

            newMaximumFee:
                ICOD.newMaximumFee,

            originalTransactionDate:
                activeLoan
                    ? new Date(activeLoan.transactionDate)
                    : undefined,

            renewalTransactionDate:
                new Date(`${data.transactionDate}T00:00:00`),
        });

    const udiRebate =
        requiresActiveLoan && activeLoan
            ? calculateUDIRebateAmount({
                originalTransactionDate: new Date(activeLoan.transactionDate),
                renewalTransactionDate: new Date(`${data.transactionDate}T00:00:00`),
                udi: Number(activeLoan.udi),
                terms: Number(activeLoan.terms),
                cutOffDate: CUT_OFF_DATE_UDI,
            })
            : 0;

    const transactionDate =
        dateStringToUtcDate(
            data.transactionDate
        );

    const effectivityDate =
        monthYearToUtcDate(
            data.effectivityDate
        );


    const sourceLoanBalance =
        data.transactionType === TRANSACTION_TYPES.renew &&
            activeLoan &&
            effectivityDate
            ? calculateSourceLoanBalance({
                remainingBalance:
                    Number(activeLoan.remainingBalance),

                installment:
                    Number(activeLoan.installment),

                nextCollectionDate:
                    new Date(
                        activeLoan.nextCollectionDate
                    ),

                newEffectivityDate:
                    effectivityDate,
            })
            : {
                projectedBalance: 0,
                collectionCount: 0,
            };

    if (
        Number.isNaN(
            transactionDate.getTime()
        )
    ) {
        throw new Error(
            "Invalid transaction date"
        );
    }

    if (
        Number.isNaN(
            effectivityDate.getTime()
        )
    ) {
        throw new Error(
            "Invalid effectivity date"
        );
    }

    const renewedFromId =
        requiresActiveLoan
            ? activeLoan?.computationSlipId
            : undefined;

    const shouldCreateSourceCollection =
        requiresActiveLoan && activeLoan
            ? helper.isMonthBefore(
                new Date(
                    activeLoan.nextCollectionDate
                ),
                effectivityDate
            )
            : false;

    const activeLoanBalance =
        requiresActiveLoan && activeLoan
            ? shouldCreateSourceCollection
                ? sourceLoanBalance.projectedBalance
                : Number(activeLoan.remainingBalance)
            : 0;

    const cashOut =
        calculateNetCashOut({
            transactionType: data.transactionType,

            principalAmount,

            udi,

            collectionFee,

            processingFee,

            loanProtectionFee,

            icod,

            supplementary: data.supplementary,

            activeLoanBalance: activeLoanBalance,

            udiRebate,
        });

    if (requiresActiveLoan && activeLoan) {
        if (
            shouldCreateSourceCollection &&
            sourceLoanBalance.projectedBalance > 0
        ) {
            const collectionPayload:
                CreateLoanCollectionSchema = {
                computationSlipId:
                    activeLoan.computationSlipId,

                collectionDate:
                    formatDateApi(
                        activeLoan.nextCollectionDate
                    ),

                amount:
                    Number(
                        activeLoan.installment
                    ),

                remarks:
                    "Unposted collection generated by branch during renewal",
            };

            await createLoanCollection(
                collectionPayload
            );
        }

        await repository.closeSourceLoan({
            computationSlipId:
                activeLoan.computationSlipId,

            closingBalance:
                activeLoanBalance,

            loanStatus:
                "RENEWED",
        });
    }

    return repository.createComputationSlip({
        pensionerId: data.pensionerId,

        branchName: data.branchName,

        transactionDate,
        effectivityDate,

        transactionType: data.transactionType,

        installment: data.installment,

        terms: data.terms,

        supplementary: data.supplementary,

        principalAmount,

        udi,
        collectionFee,
        processingFee,
        loanProtectionFee,
        icod,

        grossCashOut: cashOut.grossCashout,

        netCashOut: cashOut.netCashOut,

        totalCashOut: cashOut.totalCashOut,

        renewedFromId,

        loanStatus: "ACTIVE",
    });
}

export async function getNextControlNumber(
    branchName: string
) {
    const normalizedBranchName =
        branchName.trim().toUpperCase();

    if (!normalizedBranchName) {
        throw new Error(
            "Branch name is required"
        );
    }

    const latest =
        await repository.findLatestCounterByBranch(
            normalizedBranchName
        );

    const counterNumber =
        (latest?.counterNumber ?? 0) + 1;

    const controlNumber =
        `CTR-${String(counterNumber).padStart(5, "0")}`;

    return {
        counterNumber,
        controlNumber,
    };
}

export async function getCompslipList(
    branchName: string
) {
    if (!branchName.trim()) {
        throw new Error("Branch name is required");
    }

    return repository.getCompslipList(
        branchName
    );
}