import { prisma } from "@/lib/database/prisma";
import { CollectionStatus } from "../../../../generated/prisma/client";
import { Prisma, PrismaClient } from "../../../../generated/prisma/client";
import { SupplementaryChargeStatus } from "../../../../generated/prisma/enums";
import { dateStringToUtcDate } from "@repo/shared";

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

type CreateSupplementaryCollectionData = {
    computationSlipId: string;
    collectionDate: Date;
    amount: number;
    monthlyCharge: number;
    availableChargeMonths: number;
    beginningBalance: number;
    endingBalance: number;
    paidChargeMonths: number;
    remainingChargeMonths: number;
    chargeAmount: number;
    chargePaid: number;
    principalPaid: number;
    remainingCharge: number;
    remarks?: string;
    status: CollectionStatus;
};

export async function createSupplementaryCollection(
    data: CreateSupplementaryCollectionData,
    db: DbClient = prisma
) {
    return db.supplementaryCollection.create({
        data: {
            computationSlipId: data.computationSlipId,

            collectionDate: data.collectionDate,

            availableChargeMonths: data.availableChargeMonths,

            amount: data.amount,

            beginningBalance: data.beginningBalance,
            endingBalance: data.endingBalance,
            paidChargeMonths: data.paidChargeMonths,
            remainingChargeMonths: data.remainingChargeMonths,
            chargeAmount: data.chargeAmount,
            chargePaid: data.chargePaid,
            principalPaid: data.principalPaid,
            remainingCharge: data.remainingCharge,
            remarks: data.remarks,
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

export async function findLatestPostedSupplementaryCollection(
    computationSlipId: string,
    db: DbClient = prisma,
) {
    return db.supplementaryCollection.findFirst({
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

type CreatePendingSupplementaryCollectionData = {
    computationSlipId: string;

    collectionDate: Date;

    amount: number;

    beginningBalance: number;
    endingBalance: number;


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
    data: CreatePendingSupplementaryCollectionData,
    db: DbClient = prisma
) {
    return db.supplementaryCollection.create({
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

export async function getOutstandingSupplementaryChargesForPensioner(
    pensionerId: string
) {
    const charges =
        await prisma.supplementaryCharge.findMany({
            where: {
                computationSlip: {
                    pensionerId,
                },

                status: {
                    in: [
                        SupplementaryChargeStatus.UNPAID,
                        SupplementaryChargeStatus.PARTIAL,
                    ],
                },
            },

            select: {
                chargeAmount: true,
                paidAmount: true,
            },
        });

    return charges.reduce(
        (total, charge) =>
            total +
            Math.max(
                0,
                Number(charge.chargeAmount) -
                Number(charge.paidAmount)
            ),
        0
    );
}

type GenerateSupplementaryChargeScheduleParams = {
    transactionDate: Date;
    supplementaryBalance: number;
    supplementaryRate: number;
    terms: number;
};

export function generateSupplementaryChargeSchedule({
    transactionDate,
    supplementaryBalance,
    supplementaryRate,
    terms,
}: GenerateSupplementaryChargeScheduleParams): SupplementaryChargeScheduleItem[] {
    if (
        supplementaryBalance <= 0 ||
        supplementaryRate < 0 ||
        terms <= 0
    ) {
        return [];
    }

    console.log('sl-collection repo effectivityDate', transactionDate)

    const monthlyCharge =
        roundMoney(
            supplementaryBalance *
            (supplementaryRate / 100)
        );

    const schedule: SupplementaryChargeScheduleItem[] = [];

    for (let index = 0; index < terms; index++) {

        const dateStart = dateStringToUtcDate(transactionDate);

        const chargeMonth = new Date(dateStart);

        chargeMonth.setUTCMonth(
            chargeMonth.getUTCMonth() + index + 1
        );


        console.log('sl-collection repo effectivityDate after converted', chargeMonth)

        schedule.push({
            chargeMonth,

            principalBasis:
                supplementaryBalance,

            rate:
                supplementaryRate,

            chargeAmount:
                monthlyCharge,
        });
    }

    return schedule;
}

function roundMoney(
    value: number
): number {
    return (
        Math.round(
            value * 100
        ) / 100
    );
}

type SupplementaryChargeScheduleItem = {
    chargeMonth: Date;
    principalBasis: number;
    rate: number;
    chargeAmount: number;
};

export async function createSupplementaryChargeSchedule(
    computationSlipId: string,
    schedule: SupplementaryChargeScheduleItem[],
    db: DbClient = prisma
) {
    if (schedule.length === 0) {
        return;
    }

    return db.supplementaryCharge.createMany({
        data: schedule.map(
            (item) => ({
                computationSlipId,

                chargeMonth:
                    item.chargeMonth,

                principalBasis:
                    item.principalBasis,

                rate:
                    item.rate,

                chargeAmount:
                    item.chargeAmount,

                paidAmount:
                    0,

                status: SupplementaryChargeStatus.SCHEDULED,
            })
        ),
    });
}

export async function supersedeFutureCharges(
    computationSlipId: string,
    newEffectivityDate: Date,
    db: DbClient = prisma
) {
    return db.supplementaryCharge.updateMany({
        where: {
            computationSlipId,

            chargeMonth: {
                gte:
                    newEffectivityDate,
            },

            status: {
                in: [
                    SupplementaryChargeStatus.SCHEDULED,
                    SupplementaryChargeStatus.UNPAID,
                ],
            },
        },

        data: {
            status: SupplementaryChargeStatus.SUPERSEDED,
        },
    });
}

export async function markDueSupplementaryChargesAsUnpaid(
    computationSlipId: string,
    transactionDate: Date,
    db: DbClient = prisma
) {
    const transactionMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);

    const startDate = dateStringToUtcDate(transactionMonth);

    console.log("markDueSupplementaryChargesAsUnpaid", startDate)

    return db.supplementaryCharge.updateMany({
        where: {
            computationSlipId,

            status: "SCHEDULED",

            chargeMonth: { lte: startDate },
        },

        data: {
            status: "UNPAID",
        },
    });
}

export async function findCarriedSupplementaryCharges(
    pensionerId: string,
    sourceComputationSlipId: string,
    db: DbClient = prisma
) {
    return db.supplementaryCharge.findMany({
        where: {
            computationSlip: {
                pensionerId,
            },

            // Everything before the current source loan
            computationSlipId: {
                not: sourceComputationSlipId,
            },

            status: {
                in: [
                    SupplementaryChargeStatus.UNPAID,
                    SupplementaryChargeStatus.PARTIAL,
                ],
            },
        },

        orderBy: {
            chargeMonth: "asc",
        },
    });
}

export async function findCurrentSupplementaryChargesToPay(
    computationSlipId: string,
    monthsToPay: number,
    db: DbClient = prisma
) {
    if (monthsToPay <= 0) {
        return [];
    }

    return db.supplementaryCharge.findMany({
        where: {
            computationSlipId,

            status: {
                in: [
                    SupplementaryChargeStatus.UNPAID,
                    SupplementaryChargeStatus.PARTIAL,
                ],
            },
        },

        orderBy: {
            chargeMonth: "asc",
        },

        take: monthsToPay,
    });
}

export async function markSupplementaryChargesAsPaid(
    chargeIds: string[],
    db: DbClient = prisma
) {
    if (chargeIds.length === 0) {
        return;
    }

    const charges =
        await db.supplementaryCharge.findMany({
            where: {
                id: {
                    in: chargeIds,
                },
                status: {
                    in: [
                        SupplementaryChargeStatus.UNPAID,
                        SupplementaryChargeStatus.PARTIAL
                    ],
                },
            },
        });

    for (const charge of charges) {
        await db.supplementaryCharge.update({
            where: {
                id: charge.id,
            },
            data: {
                paidAmount:
                    charge.chargeAmount,

                status:
                    SupplementaryChargeStatus.UNPAID,
            },
        });
    }
}

export async function findLastPaidSupplementaryCharge(
    computationSlipId: string,
    db: DbClient = prisma,
) {
    return db.supplementaryCharge.findFirst({
        where: {
            computationSlipId,
            status: SupplementaryChargeStatus.PAID,
        },

        orderBy: [
            {
                chargeMonth: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
}


export async function recalculateFutureSupplementaryCharges(
    computationSlipId: string,
    afterCollectionDate: Date,
    supplementaryBalance: number,
    supplementaryRate: number,
    db: DbClient = prisma
) {
    const nextMonth =
        new Date(
            afterCollectionDate.getFullYear(),
            afterCollectionDate.getMonth() + 1,
            1
        );

    const monthlyCharge =
        roundMoney(
            supplementaryBalance *
            (supplementaryRate / 100)
        );

    return db.supplementaryCharge.updateMany({
        where: {
            computationSlipId,

            chargeMonth: {
                gt: nextMonth,
            },

            status: {
                in: [
                    "SCHEDULED",
                ],
            },
        },

        data: {
            principalBasis:
                supplementaryBalance,

            rate:
                supplementaryRate,

            chargeAmount:
                monthlyCharge,
        },
    });
}

export async function findOutstandingChargesByLoan(
    computationSlipId: string,
    db: DbClient = prisma
) {
    return db.supplementaryCharge.findMany({
        where: {
            computationSlipId,

            status: {
                in: [
                    SupplementaryChargeStatus.UNPAID,
                    SupplementaryChargeStatus.PARTIAL,
                ],
            },
        },

        orderBy: {
            chargeMonth: "asc",
        },
    });
}