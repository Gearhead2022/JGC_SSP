import { addMonthsToDate, dateStringToUtcDate, type CreateLoanCollectionSchema } from "@repo/shared";
import * as supplementaeyRepository from "./sl-collection.repository";

export async function createSupplementaryCollection(
    data: CreateLoanCollectionSchema
) {
    const computationSlip = await supplementaeyRepository.findComputationSlipById(data.computationSlipId);

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
    const existingCollection = await supplementaeyRepository.findCollectionByDate(
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
        await supplementaeyRepository.findLatestPostedCollection(
            data.computationSlipId
        );

    const beginningBalance =
        latestPostedCollection
            ? Number(
                latestPostedCollection.endingBalance
            )
            : Number(
                computationSlip.supplementary
            );

    if (beginningBalance <= 0) {
        throw new Error(
            "This loan is already fully paid"
        );
    }

    const amount = Math.min(data.amount, beginningBalance);

    const endingBalance = Math.max(0, beginningBalance - amount);

    return supplementaeyRepository.createSupplementaryCollection({
        computationSlipId: data.computationSlipId,

        collectionDate,

        amount,

        beginningBalance,

        endingBalance,

        remarks: data.remarks ?? 'Normal Collection',

        status: "PENDING",
    });
}

