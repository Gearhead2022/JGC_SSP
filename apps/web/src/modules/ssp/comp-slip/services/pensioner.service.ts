import api from "@/lib/api/api-client";
import type { ActiveLoanCollection, ApiResponse, CalculateComputationSlipSchema, CompslipListItem, ComputationSlipCalculationResult, CreateComputationSlipSchema, Pensioner } from "@repo/shared";

export async function searchPensioners(search: string) {
    const response = await api.get<ApiResponse<Pensioner[]>>(
        "/ssp/comp-slip/pensioners",
        {
            params: {
                search,
            },
        }
    );

    return response.data;
}

export async function calculateComputationSlip(
    data: CalculateComputationSlipSchema
) {
    const response = await api.post<
        ApiResponse<ComputationSlipCalculationResult>
    >(
        "/ssp/comp-slip/calculate",
        data
    );

    return response.data;
}

export const compSlipService = async (
    params: CreateComputationSlipSchema
): Promise<ApiResponse<CreateComputationSlipSchema>> => {
    const res = await api.post<ApiResponse<CreateComputationSlipSchema>>(
        "/ssp/comp-slip",
        params
    );

    return res.data;
};

export type NextControlNumber = {
    counterNumber: number;
    controlNumber: string;
};

export async function getNextControlNumber(
    branchName: string
) {
    const response = await api.get<ApiResponse<NextControlNumber>>(
        "/ssp/comp-slip/next-control-number",
        {
            params: {
                branchName,
            },
        }
    );

    return response.data.data;
}

export async function getCompslipList(
    branchName: string
) {
    const response = await api.get<ApiResponse<CompslipListItem[]>>(
        "/ssp/comp-slip/",
        {
            params: {
                branchName,
            },
        }
    );

    return response.data.data;
}

export async function getActiveLoanByPensionerIdAndAccountNo(
    pensionerId: string,
    accountNumber: string
) {
    const response = await api.get<ApiResponse<ActiveLoanCollection>>(
        `/ssp/loan-collections/active/${pensionerId}`,
        {
            params: { accountNumber }
        }
    );

    return response.data;
}