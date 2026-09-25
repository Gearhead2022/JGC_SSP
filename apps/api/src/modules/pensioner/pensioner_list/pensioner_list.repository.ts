import { prisma } from "@/lib/database/prisma";
import { QueryParams } from "../../../../../../packages/shared/src/types/query.types";
import { Prisma } from "../../../../generated/prisma/client";


export async function displayPensioner(params: QueryParams) {
    const {
        page = 1,
        limit = 10,
        search
    } = params;

    const where: Prisma.PensionerWhereInput = {};

    if (search?.trim()) {
        where.OR = [
            {
                firstName: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                lastName: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }


    const [pensioner, total] =
        await prisma.$transaction([
            prisma.pensioner.findMany({
                where,
                select: {
                    id: true,
                    legacyPensionerId: true,
                    lastName: true,
                    firstName: true,
                    actualPension: true,
                    contingencyDate:true,
                    bankName:true,
                    birthDate:true,
                },

                skip: (page - 1) * limit,
                take: limit,
               orderBy:{
                createdAt:"desc"
               }
            }),

            prisma.pensioner.count({
                where,
            }),
        ]);

    return {
        data: pensioner,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(
                total / limit
            ),
        },
    };
}





export async function addPensioner(data: {
    firstName: string;
    lastName: string;
    legacyPensionerId: number;
    actualPension:number;
    contingencyDate:Date;
    bankName:string;
    birthDate:Date;

}) {
   return prisma.$transaction(async (tx) => {

    const pensioner = await tx.pensioner.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                legacyPensionerId: data.legacyPensionerId,
                actualPension: data.actualPension,
                contingencyDate: data.contingencyDate,
                birthDate: data.birthDate,
                bankName: data.bankName,
            },
        });

    return pensioner;
});
}
