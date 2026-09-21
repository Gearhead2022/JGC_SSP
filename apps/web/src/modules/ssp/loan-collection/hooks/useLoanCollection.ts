import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createLoanCollection, getActiveLoanCollection, getLoanCollectionHistory, postLoanCollection } from "../services/loan-collection.service";

export function useCreateLoanCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLoanCollection,

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: [
                    "loan-collection", ,
                    variables.pensionerId,
                ],
            });
        },
    });
}

export function useActiveLoanCollection(
    pensionerId?: string
) {
    return useQuery({
        queryKey: [
            "loan-collection",
            "active-loan-collection",
            pensionerId,
        ],

        queryFn: () =>
            getActiveLoanCollection(
                pensionerId!
            ),

        enabled: !!pensionerId,
    });
}


export function useLoanCollectionHistory(
    computationSlipId?: string
) {
    return useQuery({
        queryKey: [
            "loan-collection",
            "loan-collection-history",
            computationSlipId,
        ],

        queryFn: () =>
            getLoanCollectionHistory(
                computationSlipId!
            ),

        enabled: !!computationSlipId,
    });
}

export function usePostLoanCollection() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: postLoanCollection,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [
                    "loan-collection",
                ],
            });
        },
    });
}