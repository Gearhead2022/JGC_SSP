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
    CalculateComputationSlipSchema,
    calculateLoanEffectivityDate,
    CUT_OFF_DATE_FOR_EFFECTIVITY,
    LOAN_STATUS_TYPES,
    calculateSupplementaryCharge,
    SL_RATE,
    applySupplementaryPayment,
    addMonthsToDate,
} from "@repo/shared";
import { prisma } from "@/lib/database/prisma";

import { COLLECTION_FEE, ICOD, LOAN_PROTECTION_FEE, PROCESSING_FEE, UDI_RATE, } from "@repo/shared";

import * as compslipRepository from "./comp-slip.repository";
import * as helper from "./comp-slip.helper";
import * as supplementaryRepository from "../sl-collection/sl-collection.repository";
import { getActiveLoanByPensionerIdAndAccountNo } from "../loan-collection/loan-collection.service";

export async function searchPensioners(search: string) {
    const normalizedSearch = search.trim();

    if (normalizedSearch.length < 2) {
        return [];
    }

    const pensioners = await compslipRepository.searchPensioners(normalizedSearch);

    return pensioners;

}

export async function calculateComputationSlip(
    data: CalculateComputationSlipSchema
) {
    const pensioner =
        await compslipRepository.findPensionerById(
            data.pensionerId
        );

    if (!pensioner) {
        throw new Error("Pensioner not found");
    }

    const age = getAge(pensioner.birthDate);

    const requiresActiveLoan = data.transactionType === TRANSACTION_TYPES.renew;

    let activeLoan = null;
    let lastPayment = null;

    const transactionDate = dateStringToUtcDate(data.transactionDate);

    if (Number.isNaN(transactionDate.getTime())) {
        throw new Error("Invalid transaction date");
    }

    if (requiresActiveLoan) {
        if (!data.accountNumber) {
            throw new Error(
                "Loan account number is required for renewal"
            );
        }

        activeLoan =
            await getActiveLoanByPensionerIdAndAccountNo(
                pensioner.id,
                data.accountNumber
            )

        lastPayment = await supplementaryRepository.findLatestPostedCollection(activeLoan.computationSlipId);
    }

    // ALL BUSINESS CALCULATIONS HERE ONLY

    const paidTermsBeforeRenewal = activeLoan?.paidTerms ?? 0;
    const totalSupplementaryBalance = data.supplementary + Number(activeLoan?.supplementaryBalance ?? 0);

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

            sl: totalSupplementaryBalance,

            percentage: ICOD.percentage,

            existingAmountFee:
                ICOD.existingAmountFee,

            newMaximumFee:
                ICOD.newMaximumFee,

            originalTransactionDate:
                activeLoan
                    ? new Date(activeLoan.transactionDate)
                    : undefined,

            renewalTransactionDate: transactionDate,
        });

    const udiRebate =
        requiresActiveLoan && activeLoan
            ? calculateUDIRebateAmount({
                originalTransactionDate: new Date(activeLoan.transactionDate),
                renewalTransactionDate: transactionDate,
                udi: Number(activeLoan.udi),
                terms: Number(activeLoan.terms),
                cutOffDate: CUT_OFF_DATE_UDI,
            })
            : 0;

    const effectivityDate =
        calculateLoanEffectivityDate({
            date: transactionDate,
            cutOffDate: CUT_OFF_DATE_FOR_EFFECTIVITY,
        });
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

    const supplementaryChargeStartDate =
        lastPayment?.collectionDate
            ? addMonthsToDate(
                new Date(lastPayment.collectionDate),
                1
            )
            : activeLoan
                ? new Date(activeLoan.effectivityDate)
                : transactionDate;

    const supplementaryChargeResult =
        requiresActiveLoan && activeLoan && totalSupplementaryBalance > 0
            ? calculateSupplementaryCharge({
                startDate: supplementaryChargeStartDate,

                transactionDate,

                supplementaryBalance: totalSupplementaryBalance,

                supplementaryRate: SL_RATE,

                monthsToPay: data.supplementaryChargeMonthsToPay,
            })
            : {
                availableMonths: 0,
                monthsToPay: 0,
                remainingMonths: 0,
                monthlyCharge: 0,
                totalCharge: 0,
            };

    // const paymentResult =
    //     applySupplementaryPayment({
    //         paymentAmount: 1000,

    //         supplementaryBalance: 6000,

    //         supplementaryChargeAmount:
    //             supplementaryChargeResult.totalCharge,

    //         applyCharge: true,
    //     });

    const supplementaryChargeToPay =
        data.applySupplementaryCharge
            ? supplementaryChargeResult.totalCharge
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

            supplementaryCharge: supplementaryChargeToPay,
        });

    return {
        pensionerId: data.pensionerId,
        accountNumber: data.accountNumber,
        branchName: data.branchName,

        transactionDate: data.transactionDate,
        transactionType: data.transactionType,

        installment: data.installment,
        terms: data.terms,
        supplementary: data.supplementary,
        supplementaryBalance: totalSupplementaryBalance,

        applySupplementaryCharge:
            data.applySupplementaryCharge,

        supplementaryCharge:
            supplementaryChargeResult.totalCharge,

        supplementaryChargeToPay,

        supplementaryChargeMonthly:
            supplementaryChargeResult.monthlyCharge,

        supplementaryChargeAvailableMonths:
            supplementaryChargeResult.availableMonths,

        supplementaryChargeMonthsToPay:
            supplementaryChargeResult.monthsToPay,

        supplementaryChargeRemainingMonths:
            supplementaryChargeResult.remainingMonths,

        effectivityDate: formatDateApi(effectivityDate),

        principalAmount,
        udi,
        collectionFee,
        processingFee,
        loanProtectionFee,
        icod,
        udiRebate,
        activeLoanBalance,

        grossCashOut: cashOut.grossCashout,
        netCashOut: cashOut.netCashOut,
        totalCashOut: cashOut.totalCashOut,

        renewedFromId: renewedFromId,

        shouldCreateSourceCollection,
    };
}

export async function createComputationSlip(
    data: CreateComputationSlipSchema
) {
    const isRenew = data.transactionType === TRANSACTION_TYPES.renew;

    if (isRenew && !data.renewedFromId
    ) {
        throw new Error(
            "Source loan is required for renewal"
        );
    }

    const transactionDate =
        dateStringToUtcDate(
            data.transactionDate
        );

    const effectivityDate =
        dateStringToUtcDate(
            data.effectivityDate
        );

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

    return prisma.$transaction(async (tx) => {

        if (isRenew) {
            /**
            * Regular loan collection
            */

            if (
                data.shouldCreateSourceCollection &&
                data.sourceCollectionCount > 0 &&
                data.sourceCollection
            ) {

                const beginningBalance =
                    data.activeLoanBalance +
                    data.sourceCollection.amount;

                const endingBalance =
                    data.activeLoanBalance;

                await compslipRepository.createPendingCollection(
                    tx,
                    {
                        computationSlipId:
                            data
                                .sourceCollection
                                .computationSlipId,

                        collectionDate:
                            dateStringToUtcDate(
                                data
                                    .sourceCollection
                                    .collectionDate
                            ),

                        amount:
                            data
                                .sourceCollection
                                .amount,

                        beginningBalance,

                        endingBalance,

                        remarks:
                            "Unposted collection generated during renewal",
                    }
                );
            }

            /**
            * Supplementary charge collection
            */

            if (
                data.applySupplementaryCharge &&
                data.supplementaryChargeToPay > 0 &&
                data.renewedFromId
            ) {
                const supplementaryBeginningBalance =
                    data.supplementaryBalance;

                /**
                 * For now this transaction only pays
                 * supplementary charges.
                 *
                 * No SL principal reduction yet.
                 */
                const supplementaryEndingBalance =
                    supplementaryBeginningBalance;

                await supplementaryRepository.createPendingSupplementaryCollection(
                    tx,
                    {
                        computationSlipId:
                            data.renewedFromId,

                        collectionDate:
                            transactionDate,

                        amount:
                            data.supplementaryChargeToPay,

                        beginningBalance:
                            supplementaryBeginningBalance,

                        endingBalance:
                            supplementaryEndingBalance,

                        monthlyCharge:
                            data.supplementaryChargeMonthly,

                        availableChargeMonths:
                            data.supplementaryChargeAvailableMonths,

                        paidChargeMonths:
                            data.supplementaryChargeMonthsToPay,

                        remainingChargeMonths:
                            data.supplementaryChargeRemainingMonths,

                        chargeAmount:
                            data.supplementaryCharge,

                        chargePaid:
                            data.supplementaryChargeToPay,

                        remainingCharge:
                            Math.max(
                                0,
                                data.supplementaryCharge -
                                data.supplementaryChargeToPay
                            ),

                        principalPaid:
                            0,

                        remarks:
                            "Supplementary charge generated during renewal",
                    }
                );

                /**
                 * Close source loan
                 */

                await compslipRepository.closeSourceLoan(
                    tx,
                    {
                        computationSlipId:
                            data
                                .renewedFromId!,

                        closingBalance:
                            data
                                .activeLoanBalance,

                        loanStatus:
                            "RENEWED",
                    }
                );
            }
        }

        return compslipRepository.createComputationSlip(
            tx,
            {
                pensionerId:
                    data.pensionerId,

                branchName:
                    data.branchName,

                transactionDate,

                effectivityDate,

                transactionType:
                    data.transactionType,

                installment:
                    data.installment,

                terms:
                    data.terms,

                supplementary:
                    data.supplementary,

                supplementaryBalance:
                    data.supplementaryBalance,

                principalAmount:
                    data.principalAmount,

                udi:
                    data.udi,

                collectionFee:
                    data.collectionFee,

                processingFee:
                    data.processingFee,

                loanProtectionFee:
                    data.loanProtectionFee,

                icod:
                    data.icod,

                grossCashOut:
                    data.grossCashOut,

                netCashOut:
                    data.netCashOut,

                totalCashOut:
                    data.totalCashOut,

                renewedFromId:
                    data.renewedFromId,

                loanStatus: data.loanStatus,
            }
        );
    }
    );
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
        await compslipRepository.findLatestCounterByBranch(
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

    return compslipRepository.getCompslipList(
        branchName
    );
}