import { prisma } from "@/lib/database/prisma";
import { LoanStatus } from "../../../../generated/prisma/client";
import { Prisma, PrismaClient } from "../../../../generated/prisma/client";
import { CreateLoanCollectionData } from "./loan-collection.types";

export type DbClient =
    PrismaClient |
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

export async function createLoanCollection(
    data: CreateLoanCollectionData,
    db: DbClient = prisma
) {
    return db.loanCollection.create({
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
            // status: "ACTIVE",
            status: {
                in: [
                    LoanStatus.ACTIVE,
                    LoanStatus.RENEWED
                ]
            },
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
            // status: "ACTIVE",
            status: {
                in: [
                    LoanStatus.ACTIVE,
                    LoanStatus.RENEWED
                ]
            },
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
    collectionDate: Date,
    db: DbClient = prisma
) {
    return db.loanCollection.findUnique({
        where: {
            computationSlipId_collectionDate: {
                computationSlipId,
                collectionDate,
            },
        },
    });
}

export async function findLatestPostedLoanCollection(
    computationSlipId: string,
    db: DbClient = prisma,
) {
    return db.loanCollection.findFirst({
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
    collectionId: string,
    db: DbClient = prisma,
) {
    return db.loanCollection.findUnique({
        where: {
            id: collectionId,
        },
    });
}

export async function postLoanCollection(
    collectionId: string,
    db: DbClient = prisma,
) {
    return db.loanCollection.update({
        where: {
            id: collectionId,
        },
        data: {
            status: "POSTED",
            postedAt: new Date(),
        },
    });
}

export async function updateLoanStatus(
    computationSlipId: string,
    loanStatus: "CLOSED" | "RENEWED",
    db: DbClient = prisma
) {
    return db.computationSlip.update({
        where: {
            id:
                computationSlipId,
        },

        data: {
            status:
                loanStatus,

            ...(loanStatus === "CLOSED"
                ? {
                    closingBalance: 0,
                    closedAt:
                        new Date(),
                }
                : {}),
        },
    });
}