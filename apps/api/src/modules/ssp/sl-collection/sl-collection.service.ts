import { addMonthsToDate, dateStringToUtcDate, SL_RATE, type CreateLoanCollectionSchema } from "@repo/shared";
import * as supplementaryRepository from "./sl-collection.repository";
import { prisma } from "@/lib/database/prisma";
import * as compslipRepository from "../comp-slip/comp-slip.repository";

export async function getSupplementaryByPensionerIdAndAccountNo(
    pensionerId: string,
    accountNumber: string
) {
    if (!pensionerId) {
        throw new Error(
            "Pensioner ID is required"
        );
    }

    if (!accountNumber) {
        throw new Error(
            "Loan account number is required"
        );
    }

    const collections =
        await supplementaryRepository
            .findSupplementaryCollectionsByPensionerAndAccount(
                pensionerId,
                accountNumber
            );

    return collections.map(
        (collection) => ({
            id:
                collection.id,

            computationSlipId:
                collection.computationSlipId,

            accountNumber:
                collection
                    .computationSlip
                    .accountNumber,

            collectionDate:
                collection.collectionDate,

            amount:
                Number(
                    collection.amount
                ),

            beginningBalance:
                Number(
                    collection.beginningBalance
                ),

            endingBalance:
                Number(
                    collection.endingBalance
                ),

            availableChargeMonths:
                collection.availableChargeMonths,

            paidChargeMonths:
                collection.paidChargeMonths,

            remainingChargeMonths:
                collection.remainingChargeMonths,

            chargeAmount:
                Number(
                    collection.chargeAmount
                ),

            chargePaid:
                Number(
                    collection.chargePaid
                ),

            principalPaid:
                Number(
                    collection.principalPaid
                ),

            remainingCharge:
                Number(
                    collection.remainingCharge
                ),

            status:
                collection.status,

            remarks:
                collection.remarks,

            pensioner:
                collection
                    .computationSlip
                    .pensioner,
        })
    );
}

export async function postSupplementaryCollection(
    collectionId: string
) {
    return prisma.$transaction(async (tx) => {
        const collection =
            await supplementaryRepository
                .findSupplementaryCollectionForPosting(
                    collectionId,
                    tx
                );

        if (!collection) {
            throw new Error(
                "Supplementary collection not found"
            );
        }

        if (collection.status === "POSTED") {
            throw new Error(
                "Supplementary collection is already posted"
            );
        }

        if (collection.status === "CANCELLED") {
            throw new Error(
                "Cancelled supplementary collection cannot be posted"
            );
        }

        /**
         * 1. Apply charge allocations
         */
        for (const allocation of collection.allocations) {
            const charge =
                allocation.supplementaryCharge;

            const chargeAmount =
                Number(charge.chargeAmount);

            const currentPaidAmount =
                Number(charge.paidAmount);

            const allocationAmount =
                Number(allocation.amount);

            const newPaidAmount =
                Math.min(
                    chargeAmount,
                    currentPaidAmount +
                    allocationAmount
                );

            await tx.supplementaryCharge.update({
                where: {
                    id: charge.id,
                },

                data: {
                    paidAmount:
                        newPaidAmount,

                    status:
                        newPaidAmount >=
                            chargeAmount
                            ? "PAID"
                            : "PARTIAL",
                },
            });
        }

        /**
         * 2. If payment also reduced SL principal,
         * update current balance and future charges.
         */
        const principalPaid =
            Number(
                collection.principalPaid
            );

        if (principalPaid > 0) {
            const newBalance =
                Number(
                    collection.endingBalance
                );

            await compslipRepository
                .updateSupplementaryBalance(
                    collection.computationSlipId,
                    newBalance,
                    tx
                );

            await supplementaryRepository
                .recalculateFutureSupplementaryCharges(
                    collection.computationSlipId,
                    collection.collectionDate,
                    newBalance,
                    SL_RATE,
                    tx
                );
        }

        /**
         * 3. Post the collection
         */
        return tx.supplementaryCollection.update({
            where: {
                id: collectionId,
            },

            data: {
                status: "POSTED",
                postedAt:
                    new Date(),
            },
        });
    });
}
