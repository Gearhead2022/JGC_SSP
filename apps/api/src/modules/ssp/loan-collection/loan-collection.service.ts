import { addMonthsToDate, dateStringToUtcDate, SL_RATE, type CreateLoanCollectionSchema } from "@repo/shared";
import * as repository from "./loan-collection.repository";
import * as supplementaryRepository from "../sl-collection/sl-collection.repository";
import * as compslipRepository from "../comp-slip/comp-slip.repository";
import { prisma } from "@/lib/database/prisma";

export async function createLoanCollection(
    data: CreateLoanCollectionSchema
) {
    const computationSlip =
        await repository.findComputationSlipById(
            data.computationSlipId
        );

    if (!computationSlip) {
        throw new Error(
            "Computation slip not found"
        );
    }

    const pensioner =
        await compslipRepository.findPensionerById(
            computationSlip.pensionerId
        );

    if (!pensioner) {
        throw new Error(
            "Pensioner not found"
        );
    }

    const collectionDate =
        dateStringToUtcDate(
            data.collectionDate
        );

    if (
        Number.isNaN(
            collectionDate.getTime()
        )
    ) {
        throw new Error(
            "Invalid collection date"
        );
    }

    return prisma.$transaction(
        async (tx) => {
            /**
             * Prevent duplicate regular collection
             */
            const existingCollection =
                await repository.findCollectionByDate(
                    data.computationSlipId,
                    collectionDate,
                    tx
                );

            if (existingCollection) {
                return existingCollection;
            }

            // console.log("existingCollection", existingCollection);

            /**
             * REGULAR LOAN COLLECTION
             */
            const latestPostedCollection =
                await repository.findLatestPostedLoanCollection(
                    data.computationSlipId,
                    tx
                );

            const beginningBalance =
                latestPostedCollection
                    ? Number(
                        latestPostedCollection
                            .endingBalance
                    )
                    : Number(
                        computationSlip
                            .principalAmount
                    );

            if (beginningBalance <= 0) {
                throw new Error(
                    "This loan is already fully paid"
                );
            }

            const amount =
                Math.min(
                    Number(data.amount),
                    beginningBalance
                );

            const endingBalance =
                Math.max(
                    0,
                    beginningBalance -
                    amount
                );

            const loanCollection =
                await repository.createLoanCollection(
                    {
                        computationSlipId:
                            data.computationSlipId,

                        collectionDate,

                        amount,

                        beginningBalance,

                        endingBalance,

                        remarks:
                            data.remarks ??
                            "Normal Collection",

                        status:
                            "PENDING",
                    },

                    tx
                );

            /**
             * SUPPLEMENTARY PRINCIPAL COLLECTION
             *
             * Whatever remains from the pension
             * after the regular installment may
             * be applied to SL principal.
             */
            const availableForSupplementary = Math.max(0, Number(pensioner.actualPension) - amount);

            const latestPostedSupplementaryCollection =
                await supplementaryRepository.findLatestPostedSupplementaryCollection(
                    data.computationSlipId,
                    tx
                );

            const currentSupplementaryBalance =
                latestPostedSupplementaryCollection
                    ? Number(
                        latestPostedSupplementaryCollection
                            .endingBalance
                    )
                    : Number(
                        computationSlip
                            .supplementaryBalance
                    );

            if (
                availableForSupplementary > 0 &&
                currentSupplementaryBalance > 0
            ) {
                /**
                 * Never pay more than the
                 * remaining SL principal.
                 */
                const supplementaryPrincipalPaid =
                    Math.min(
                        availableForSupplementary,
                        currentSupplementaryBalance
                    );

                const supplementaryEndingBalance =
                    Math.max(
                        0,
                        currentSupplementaryBalance -
                        supplementaryPrincipalPaid
                    );

                // this should be on posting function or maybe added but not posted yet

                /**
                * mark supllementary charge as unpaid prior to collection date
                * prior to collection date less than and equal to
                */

                await supplementaryRepository
                    .markDueSupplementaryChargesAsUnpaid(
                        data.computationSlipId,
                        dateStringToUtcDate(collectionDate),
                        tx
                    );

                /**
                * recalculate supplemantary charges
                * prior to collection date greater than
                */

                await supplementaryRepository
                    .recalculateFutureSupplementaryCharges(
                        data.computationSlipId,
                        collectionDate,
                        supplementaryEndingBalance,
                        SL_RATE,
                        tx
                    );

                /**
                * create supplementary collection
                * prior to collection date
                */

                await supplementaryRepository.createSupplementaryCollection(
                    {
                        computationSlipId: data.computationSlipId,

                        collectionDate,

                        amount: supplementaryPrincipalPaid,

                        beginningBalance: currentSupplementaryBalance,

                        endingBalance: supplementaryEndingBalance,

                        monthlyCharge: 0,

                        availableChargeMonths: 0,

                        paidChargeMonths: 0,

                        remainingChargeMonths: 0,

                        chargeAmount: 0,

                        chargePaid: 0,

                        remainingCharge: 0,

                        principalPaid: supplementaryPrincipalPaid,

                        remarks: "Supplementary principal collection",

                        status: "PENDING",
                    },

                    tx
                );

                /**
                * Update Supplementary balance in compslip
                * prior to collection date
                */

                await compslipRepository
                    .updateSupplementaryBalance(
                        data.computationSlipId,
                        supplementaryEndingBalance,
                        tx
                    );
            }

            return loanCollection;
        }
    );
}

export async function getActiveLoanByPensionerId(
    pensionerId: string
) {
    const computationSlips =
        await repository.findActiveComputationSlipByPensionerId(
            pensionerId
        );

    if (computationSlips.length === 0) {
        throw new Error("No active computation slip found");
    }

    return computationSlips.map((computationSlip) => {
        const collections = computationSlip.loanCollections;

        const latestCollection =
            collections.length > 0
                ? collections[collections.length - 1]
                : null;

        const remainingBalance =
            latestCollection
                ? Number(
                    latestCollection.endingBalance
                )
                : Number(
                    computationSlip.principalAmount
                );

        const paidTerms = collections.length;

        const effectivityDate = computationSlip.effectivityDate;

        const transactionDate = computationSlip.transactionDate;

        const nextCollectionDate =
            addMonthsToDate(
                effectivityDate,
                paidTerms
            );

        const loanStatus = computationSlip.status;

        return {
            computationSlipId:
                computationSlip.id,

            accountNumber:
                computationSlip.accountNumber,

            controlNumber:
                computationSlip.controlNumber,

            counterNumber:
                computationSlip.counterNumber,

            branchName:
                computationSlip.branchName,

            status:
                computationSlip.status,

            transactionType:
                computationSlip.transactionType,

            pensioner: {
                id:
                    computationSlip.pensioner.id,

                legacyPensionerId:
                    computationSlip.pensioner
                        .legacyPensionerId,

                firstName:
                    computationSlip.pensioner
                        .firstName,

                middleName:
                    computationSlip.pensioner
                        .middleName,

                lastName:
                    computationSlip.pensioner
                        .lastName,
            },

            installment:
                Number(
                    computationSlip.installment
                ),

            principalAmount:
                Number(
                    computationSlip.principalAmount
                ),

            udi:
                Number(
                    computationSlip.udi
                ),

            terms:
                computationSlip.terms,

            effectivityDate,

            transactionDate,

            paidTerms,

            remainingBalance,

            nextCollectionDate,

            loanStatus,

            supplementary: computationSlip.supplementary,

            supplementaryBalance: Number(computationSlip.supplementaryBalance),
        };
    });
}

export async function getActiveLoanByPensionerIdAndAccountNo(
    pensionerId: string,
    accountNumber: string
) {
    const computationSlip =
        await repository.findActiveComputationSlipByPensionerIdAndAccountNo(
            pensionerId,
            accountNumber
        );

    if (!computationSlip) {
        throw new Error(
            "No active computation slip found"
        );
    }

    const postedCollections =
        computationSlip.loanCollections.filter(
            (collection) =>
                collection.status === "POSTED"
        );

    const latestPostedCollection =
        postedCollections.length > 0
            ? postedCollections[
            postedCollections.length - 1
            ]
            : null;

    const remainingBalance =
        latestPostedCollection
            ? Number(
                latestPostedCollection.endingBalance
            )
            : Number(
                computationSlip.principalAmount
            );

    const paidTerms =
        postedCollections.length;

    const effectivityDate =
        computationSlip.effectivityDate;

    const transactionDate =
        computationSlip.transactionDate;

    const nextCollectionDate =
        addMonthsToDate(
            effectivityDate,
            paidTerms
        );

    return {
        computationSlipId:
            computationSlip.id,

        accountNumber:
            computationSlip.accountNumber,

        pensioner: {
            id:
                computationSlip.pensioner.id,

            legacyPensionerId:
                computationSlip.pensioner
                    .legacyPensionerId,

            firstName:
                computationSlip.pensioner
                    .firstName,

            middleName:
                computationSlip.pensioner
                    .middleName,

            lastName:
                computationSlip.pensioner
                    .lastName,
        },

        installment:
            Number(
                computationSlip.installment
            ),

        principalAmount:
            Number(
                computationSlip.principalAmount
            ),

        udi:
            Number(
                computationSlip.udi
            ),

        terms:
            computationSlip.terms,

        effectivityDate,
        transactionDate,

        paidTerms,

        remainingBalance,

        nextCollectionDate,

        loanStatus:
            computationSlip.status,

        supplementary: computationSlip.supplementary,

        supplementaryBalance: Number(computationSlip.supplementaryBalance),
    };
}

export async function getLoanCollectionHistory(
    computationSlipId: string
) {
    return repository.findCollectionHistory(
        computationSlipId
    );
}

export async function postLoanCollection(
    collectionId: string
) {
    const collection =
        await repository.findLoanCollectionById(
            collectionId
        );

    if (!collection) {
        throw new Error(
            "Collection not found"
        );
    }

    if (collection.status === "POSTED") {
        throw new Error(
            "Collection is already posted"
        );
    }

    if (collection.status === "CANCELLED") {
        throw new Error(
            "Cancelled collection cannot be posted"
        );
    }

    return repository.postLoanCollection(
        collectionId
    );
}
