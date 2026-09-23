import { PensionerSchemaType } from "@repo/shared";
import { QueryParams } from "../../../../../../packages/shared/src/types/query.types";
import * as pensionerRepositoryList from "./pensioner_list.repository";







export async function getPensioners(params: QueryParams) {
    const result = await pensionerRepositoryList.displayPensioner(params);

    const normalized = result.data.map((pen) => ({
        id: pen.id,
        firstName: pen.firstName ?? "",
        lastName: pen.lastName ?? "",
        legacyPensionerId: pen.legacyPensionerId ?? 0,
        actualPension: Number(pen.actualPension ?? 0),
        contingencyDate: pen.contingencyDate ?? "",
        bankName: pen.bankName ?? "",
        birthDate: pen.birthDate ?? "",
    }));


    return {
        data: normalized,
        pagination: result.pagination,
    };
}





export async function createPensioner(params: PensionerSchemaType) {
    const {
        firstName,
        lastName,
        legacyPensionerId,
        actualPension,
        contingencyDate,
        bankName,
        birthDate,
    } = params;

    const user = await pensionerRepositoryList.addPensioner({
            firstName,
            lastName,
            legacyPensionerId,
            actualPension,
            bankName,
            contingencyDate: new Date(`${contingencyDate}T00:00:00.000Z`),
            birthDate: new Date(`${birthDate}T00:00:00.000Z`),
        });

    return user;
}
