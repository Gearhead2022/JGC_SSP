import { prisma } from "@/lib/database/prisma";
import { Prisma } from "../../../../generated/prisma/client";
import { DbClient, CloseSourceLoanData, CreateComputationSlipData, CreatePendingCollectionData } from "./comp-slip.types";

export async function searchPensioners(search: string) {
    const where: Prisma.PensionerWhereInput = {};

    if (search?.trim()) {
        const keyword = search.trim();

        where.OR = [
            {
                firstName: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
            {
                lastName: {
                    contains: keyword,
                    mode: "insensitive",
                },
            },
        ];
    }

    return prisma.pensioner.findMany({
        where,
        orderBy: {
            lastName: "asc",
        },
        take: 10,
    });
}

export async function findPensionerById(
    pensionerId: string
) {
    return prisma.pensioner.findFirst({
        where: {
            id: pensionerId,
            deletedAt: null,
        },
    });
}

export async function createComputationSlip(data: CreateComputationSlipData, db: DbClient = prisma) {

    const branchName = data.branchName.trim().toUpperCase();

    const {
        counterNumber,
        controlNumber,
        accountNumber,
    } = await generateLoanIdentifiers(

        branchName,
        db
    );

    return db.computationSlip.create({
        data: {
            pensionerId:
                data.pensionerId,

            counterNumber,
            controlNumber,
            accountNumber,
            branchName,

            transactionDate: data.transactionDate,

            effectivityDate: data.effectivityDate,

            transactionType: data.transactionType,

            installment: data.installment,

            terms: data.terms,

            supplementary: data.supplementary,
            supplementaryBalance: data.supplementaryBalance,

            principalAmount: data.principalAmount,

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

            renewedFromId: data.renewedFromId
        },

        include: {
            pensioner: true,
        },
    });
}

export async function getCompslipList(
    branchName: string
) {
    return prisma.computationSlip.findMany({
        where: {
            branchName: branchName.trim().toUpperCase(),
            deletedAt: null,
        },

        include: {
            pensioner: true,
            loanCollections: {
                orderBy: {
                    collectionDate: "desc",
                },
            },
        },

        orderBy: {
            counterNumber: "desc",
        },
    });
}

export async function findLatestCounterByBranch(branchName: string) {

    return prisma.computationSlip.findFirst({
        where: {
            branchName: branchName.trim(),
            deletedAt: null,
        },

        select: {
            counterNumber: true,
        },

        orderBy: {
            counterNumber: "desc",
        },
    });
}

export async function closeSourceLoan(
    data: CloseSourceLoanData,
    db: DbClient = prisma
) {
    return db.computationSlip.update({
        where: {
            id: data.computationSlipId,
        },
        data: {
            status: data.loanStatus,
            closingBalance: data.closingBalance,
            closedAt: new Date(),
        },
    });
}

export async function createPendingCollection(
    data: CreatePendingCollectionData,
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

            status:
                "PENDING",

            remarks:
                data.remarks,
        },
    });
}

async function generateLoanIdentifiers(
    branchName: string,
    db: DbClient = prisma
) {
    /**
     * Branch-specific counter/control number
     */
    const latestSlip =
        await db.computationSlip.findFirst({
            where: {
                branchName,
            },

            select: {
                counterNumber: true,
            },

            orderBy: {
                counterNumber: "desc",
            },
        });

    const counterNumber =
        (latestSlip?.counterNumber ?? 0) + 1;

    const controlNumber =
        `CTR-${String(
            counterNumber
        ).padStart(5, "0")}`;


    /**
     * Global account number
     */
    const accountCount =
        await db.computationSlip.count();

    const nextAccountNumber =
        accountCount + 1;

    const accountNumber =
        `LN-${new Date().getFullYear()}-${String(
            nextAccountNumber
        ).padStart(6, "0")}`;


    return {
        counterNumber,
        controlNumber,
        accountNumber,
    };
}

export async function updateSupplementaryBalance(
    computationSlipId: string,
    supplementaryBalance: number,
    db: DbClient = prisma
) {
    return db.computationSlip.update({
        where: {
            id: computationSlipId,
        },

        data: {
            supplementaryBalance,
        },
    });
}
