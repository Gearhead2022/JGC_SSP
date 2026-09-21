import { prisma } from "@/lib/database/prisma";
import { CollectionStatus } from "../../../../generated/prisma/client";

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

// export async function findLatestCollection(
//     computationSlipId: string
// ) {
//     return prisma.loanCollection.findFirst({
//         where: {
//             computationSlipId,
//         },
//         orderBy: [
//             {
//                 collectionDate: "desc",
//             },
//             {
//                 createdAt: "desc",
//             },
//         ],
//     });
// }

type CreateLoanCollectionData = {
    computationSlipId: string;
    collectionDate: Date;
    amount: number;
    beginningBalance: number;
    endingBalance: number;
    remarks?: string;
    status: CollectionStatus;
};

export async function createLoanCollection(
    data: CreateLoanCollectionData
) {
    return prisma.loanCollection.create({
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

            remarks:
                data.remarks,

            status: data.status
        },

        include: {
            computationSlip: {
                include: {
                    pensioner: true,
                },
            },
        },
    });
}

//Later we can make this more precise using ACTIVE, PAID, CANCELLED, etc.

export async function findActiveComputationSlipByPensionerId(
    pensionerId: string
) {
    return prisma.computationSlip.findMany({
        where: {
            pensionerId: pensionerId.trim(),
            status: "ACTIVE",
            deletedAt: null,
        },

        include: {
            loanCollections: {
                orderBy: [
                    {
                        collectionDate: "asc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],
            },

            pensioner: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function findActiveComputationSlipByPensionerIdAndAccountNo(
    pensionerId: string,
    accountNumber: string
) {
    return prisma.computationSlip.findFirst({
        where: {
            pensionerId: pensionerId.trim(),
            accountNumber: accountNumber.trim(),
            status: "ACTIVE",
            deletedAt: null,
        },

        include: {
            loanCollections: {
                where: {
                    status: "POSTED"
                },
                orderBy: [
                    {
                        collectionDate: "asc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],
            },

            pensioner: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function findCollectionHistory(
    computationSlipId: string
) {
    return prisma.loanCollection.findMany({
        where: {
            computationSlipId: computationSlipId.trim(),
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

export async function findCollectionByDate(
    computationSlipId: string,
    collectionDate: Date
) {
    return prisma.loanCollection.findUnique({
        where: {
            computationSlipId_collectionDate: {
                computationSlipId,
                collectionDate,
            },
        },
    });
}

export async function findLatestPostedCollection(
    computationSlipId: string
) {
    return prisma.loanCollection.findFirst({
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

export async function findLoanCollectionById(
    collectionId: string
) {
    return prisma.loanCollection.findUnique({
        where: {
            id: collectionId,
        },
    });
}

export async function postLoanCollection(
    collectionId: string
) {
    return prisma.loanCollection.update({
        where: {
            id: collectionId,
        },
        data: {
            status: "POSTED",
            postedAt: new Date(),
        },
    });
}