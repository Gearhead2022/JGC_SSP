import { prisma } from "@/lib/database/prisma";
import { CollectionStatus } from "../../../../generated/prisma/client";
import { Prisma } from "../../../../generated/prisma/client";

type PrismaTx =
    Prisma.TransactionClient;

export async function findComputationSlipById(
    computationSlipId: string
) {
    return prisma.computationSlip.findFirst({
        where: {
            id: computationSlipId,
            deletedAt: null,
        },
    });
}

type CreateSupplementaryCollectionData = {
    computationSlipId: string;
    collectionDate: Date;
    amount: number;
    beginningBalance: number;
    endingBalance: number;
    remarks?: string;
    status: CollectionStatus;
};

// export async function createSupplementaryCollection(
//     data: CreateSupplementaryCollectionData
// ) {
//     return prisma.supplementaryCollection.create({
//         data: {
//             computationSlipId:
//                 data.computationSlipId,

//             collectionDate:
//                 data.collectionDate,

//             amount:
//                 data.amount,

//             beginningBalance:
//                 data.beginningBalance,

//             endingBalance:
//                 data.endingBalance,

//             remarks:
//                 data.remarks,

//             status: data.status
//         },

//         include: {
//             computationSlip: {
//                 include: {
//                     pensioner: true,
//                 },
//             },
//         },
//     });
// }

export async function findLatestPostedCollection(
    computationSlipId: string
) {
    return prisma.supplementaryCollection.findFirst({
        where: {
            computationSlipId,
            status: "POSTED",
        },

        orderBy: [
            {
                collectionDate: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
}

// export async function findCollectionByDate(
//     computationSlipId: string,
//     collectionDate: Date
// ) {
//     return prisma.supplementaryCollection.findUnique({
//         where: {
//             computationSlipId_collectionDate: {
//                 computationSlipId,
//                 collectionDate,
//             },
//         },
//     });
// }

type CreatePendingSupplementaryCollectionData = {
    computationSlipId: string;

    collectionDate: Date;

    amount: number;

    beginningBalance: number;
    endingBalance: number;

    monthlyCharge: number;

    availableChargeMonths: number;
    paidChargeMonths: number;
    remainingChargeMonths: number;

    chargeAmount: number;
    chargePaid: number;
    remainingCharge: number;

    principalPaid: number;

    remarks?: string;
};


export async function createPendingSupplementaryCollection(
    tx: PrismaTx,
    data: CreatePendingSupplementaryCollectionData
) {
    return tx.supplementaryCollection.create({
        data: {
            computationSlipId:
                data.computationSlipId,

            collectionDate:
                data.collectionDate,

            amount:
                data.amount,

            beginningBalance:
                data.beginningBalance,

            endingBalance:
                data.endingBalance,

            monthlyCharge:
                data.monthlyCharge,

            availableChargeMonths:
                data.availableChargeMonths,

            paidChargeMonths:
                data.paidChargeMonths,

            remainingChargeMonths:
                data.remainingChargeMonths,

            chargeAmount:
                data.chargeAmount,

            chargePaid:
                data.chargePaid,

            remainingCharge:
                data.remainingCharge,

            principalPaid:
                data.principalPaid,

            status:
                "PENDING",

            remarks:
                data.remarks,
        },
    });
}