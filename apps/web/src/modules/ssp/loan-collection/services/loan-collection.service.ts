import api from "@/lib/api/api-client";
import { ActiveLoanCollection, ApiResponse, CreateLoanCollectionPayload, LoanCollection, LoanCollectionHistoryItem } from "@repo/shared";

export async function createLoanCollection({
    pensionerId,
    ...payload
}: CreateLoanCollectionPayload) {
    const response = await api.post<
        ApiResponse<LoanCollection>
    >(
        "/ssp/loan-collections",
        payload
    );

    return response.data;
}

export async function getActiveLoanCollection(
    pensionerId: string
) {
    const response = await api.get<ApiResponse<ActiveLoanCollection[]>>(
        `/ssp/loan-collections/active/${pensionerId}/all`
    );

    return response.data;
}

export async function getLoanCollectionHistory(
    computationSlipId: string
) {
    const response = await api.get<
        ApiResponse<LoanCollectionHistoryItem[]>
    >(
        `/ssp/loan-collections/${computationSlipId}/history`
    );

    return response.data.data;
}

export async function postLoanCollection(
    collectionId: string
) {
    const response = await api.patch<
        ApiResponse<LoanCollectionHistoryItem>
    >(
        `/ssp/loan-collections/${collectionId}/post`
    );

    return response.data;
}