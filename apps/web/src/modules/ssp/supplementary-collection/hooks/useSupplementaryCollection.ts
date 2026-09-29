import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getSupplementaryByPensionerIdAndAccountNo, postSupplementaryCollection } from "../services/sl-loan-collection.service";

export function useSupplementaryByPensionerIdAndAccountNo(
    pensionerId?: string,
    accountNumber?: string
) {
    return useQuery({
        queryKey: [
            "supplementary-loan",
            "collection-history",
            pensionerId,
            accountNumber,
        ],

        queryFn: () =>
            getSupplementaryByPensionerIdAndAccountNo(
                pensionerId!,
                accountNumber!
            ),

        enabled:
            Boolean(
                pensionerId &&
                accountNumber
            ),
    });
}

export function usePostSupplementaryCollection(
    pensionerId?: string,
    accountNumber?: string
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
            postSupplementaryCollection,

        onSuccess: async () => {
            await queryClient
                .invalidateQueries({
                    queryKey: [
                        "supplementary-loan",
                        "collection-history",
                        pensionerId,
                        accountNumber,
                    ],
                });

            /**
             * Also refresh active loan data because
             * principal posting may change SL balance.
             */
            await queryClient
                .invalidateQueries({
                    queryKey: [
                        "active-loan-collection",
                        pensionerId,
                    ],
                });
        },
    });
}