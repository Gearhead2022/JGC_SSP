import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { compSlipService, getActiveLoanByPensionerIdAndAccountNo, getCompslipList, getNextControlNumber, searchPensioners } from "../services/pensioner.service";

export function usePensionerSearch(params: { search: string }) {
    return useQuery({
        queryKey: ["pensioners", params.search],
        queryFn: () => searchPensioners(params.search),

        enabled: params.search.trim().length >= 2,
    });
}

export function useCompslipComputation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: compSlipService,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comp-slip", "loan"],
            });
        },
    });
}

export function useNextControlNumber(
    branchName?: string
) {
    return useQuery({
        queryKey: [
            "computation-slip",
            "next-control-number",
            branchName,
        ],

        queryFn: () =>
            getNextControlNumber(
                branchName!
            ),

        enabled: !!branchName,
    });
}

export function useCompslipList(
    branchName?: string
) {
    return useQuery({
        queryKey: [
            "computation-slip",
            "list",
            branchName,
        ],

        queryFn: () =>
            getCompslipList(branchName!),

        enabled: !!branchName,
    });
}

export function useActiveLoanByPensionerIdAndAccountNo(
    pensionerId?: string,
    accountNumber?: string
) {
    return useQuery({
        queryKey: [
            "computation-slip",
            "active-loan-collection",
            pensionerId,
            accountNumber,
        ],

        queryFn: () =>
            getActiveLoanByPensionerIdAndAccountNo(
                pensionerId!,
                accountNumber!
            ),

        enabled: Boolean(pensionerId && accountNumber),
    });
}
