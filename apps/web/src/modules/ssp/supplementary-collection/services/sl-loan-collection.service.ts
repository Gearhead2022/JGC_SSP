import api from "@/lib/api/api-client";
import { ApiResponse, SupplementaryLoanCollection } from "@repo/shared";

export async function getSupplementaryByPensionerIdAndAccountNo(
    pensionerId: string,
    accountNumber: string
) {
    const response = await api.get<ApiResponse<SupplementaryLoanCollection[]>>(
        `/ssp/supplementary-collections/${pensionerId}`,
        {
            params: { accountNumber }
        }
    );

    return response.data;
}

export async function postSupplementaryCollection(
    collectionId: string
) {
    const response =
        await api.patch<
            ApiResponse<SupplementaryLoanCollection>
        >(
            `/ssp/supplementary-collections/${collectionId}/post`
        );

    return response.data;
}