import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddPensionerService, getPensionerService } from "../service/pensionerListService";
import { ApiResponse, UpdatePensionerSchemaType, UserQueryParams } from "@repo/shared";





export function useCreatePensioner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAddPensionerService,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pensioner-display"],
            });
        },
    });
}


export function useGetPensioner(param: UserQueryParams) {
    return useQuery<ApiResponse<UpdatePensionerSchemaType[]>>({
        queryKey: ["pensioner-display", param],
        queryFn: () => getPensionerService(param),
    });
}

