import { addMonthsToDate, dateStringToUtcDate, type CreateLoanCollectionSchema } from "@repo/shared";
import * as repository from "./loan-collection.repository";

export async function createLoanCollection(
    data: CreateLoanCollectionSchema
) {
    const computationSlip = await repository.findComputationSlipById(data.computationSlipId);

    if (!computationSlip) {
        throw new Error(
            "Computation slip not found"
        );
    }

    const collectionDate = dateStringToUtcDate(data.collectionDate);

    /*
     * Check if this month's collection
     * has already been created.
     */
    const existingCollection = await repository.findCollectionByDate(
        data.computationSlipId,
        collectionDate
    );

    if (existingCollection) {
        return existingCollection;
    }

    /*
     * IMPORTANT:
     * Latest balance should come from
     * POSTED collections only.
     */
    const latestPostedCollection =
        await repository.findLatestPostedCollection(
            data.computationSlipId
        );

    const beginningBalance =
        latestPostedCollection
            ? Number(
                latestPostedCollection.endingBalance
            )
            : Number(
                computationSlip.principalAmount
            );

    if (beginningBalance <= 0) {
        throw new Error(
            "This loan is already fully paid"
        );
    }

    const amount = Math.min(data.amount, beginningBalance);

    const endingBalance = Math.max(0, beginningBalance - amount);

    return repository.createLoanCollection({
        computationSlipId:
            data.computationSlipId,

        collectionDate,

        amount,

        beginningBalance,

        endingBalance,

        remarks: data.remarks ?? 'Normal Collection',

        status: "PENDING",
    });
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
        const collections =
            computationSlip.loanCollections;

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

        const paidTerms =
            collections.length;

        const effectivityDate =
            computationSlip.effectivityDate;

        const transactionDate =
            computationSlip.transactionDate;

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

        supplementaryBalance:
            Number(
                computationSlip.supplementaryBalance
            ),
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


