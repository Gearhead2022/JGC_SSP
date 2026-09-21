import { prisma } from "@/lib/database/prisma";
import { LoanStatus, Prisma } from "../../../../generated/prisma/client";

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

type CreateComputationSlipData = {
    pensionerId: string;

    branchName: string;

    transactionDate: Date;
    effectivityDate: Date;

    transactionType: string;

    installment: number;
    terms: number;
    supplementary: number;

    principalAmount: number;

    udi: number;
    collectionFee: number;
    processingFee: number;
    loanProtectionFee: number;
    icod: number;

    grossCashOut: number;
    netCashOut: number;
    totalCashOut: number;

    renewedFromId?: string;

    loanStatus: LoanStatus;
};

export async function createComputationSlip(data: CreateComputationSlipData) {

    return prisma.$transaction(async (tx) => {

        const branchName = data.branchName.trim().toUpperCase();

        const latestSlip =
            await tx.computationSlip.findFirst({
                where: {
                    branchName,
                },
                select: {
                    counterNumber: true,
                },
                orderBy: {
                    counterNumber:
                        "desc",
                },
            });

        const counterNumber =
            (latestSlip?.counterNumber ??
                0) + 1;

        const controlNumber =
            `CTR-${String(
                counterNumber
            ).padStart(5, "0")}`;

        const accountCount =
            await tx.computationSlip.count();

        const nextAccountNumber =
            accountCount + 1;

        const accountNumber =
            `LN-${new Date().getFullYear()}-${String(
                nextAccountNumber
            ).padStart(6, "0")}`;

        return tx.computationSlip.create({
            data: {
                pensionerId:
                    data.pensionerId,

                counterNumber,
                controlNumber,
                accountNumber,
                branchName,

                transactionDate:
                    data.transactionDate,

                effectivityDate:
                    data.effectivityDate,

                transactionType:
                    data.transactionType,

                installment:
                    data.installment,

                terms:
                    data.terms,

                supplementary:
                    data.supplementary,

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

                renewedFromId: data.renewedFromId
            },

            include: {
                pensioner: true,
            },
        });
    }
    );
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

type CloseSourceLoanData = {
    computationSlipId: string;
    closingBalance: number;
    loanStatus:
    | "RENEWED"
    | "CLOSED";
};

export async function closeSourceLoan(
    data: CloseSourceLoanData
) {
    return prisma.computationSlip.update({
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