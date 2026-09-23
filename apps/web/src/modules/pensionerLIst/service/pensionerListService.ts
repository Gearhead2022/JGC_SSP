import api from "@/lib/api/api-client";
import { ApiResponse, PensionerSchemaType, UpdatePensionerSchemaType } from "@repo/shared";




export type Params = {
    search?: string;
};


export const getPensionerService = async (param: Params): Promise<ApiResponse<UpdatePensionerSchemaType[]>> => {
    const res = await api.get<ApiResponse<UpdatePensionerSchemaType[]>>
    ("/pensioner/pensioner-list/display-pensioner-list",{
            params: param,
        }
    );
    return res.data;
};




export const createAddPensionerService = async (params: PensionerSchemaType): Promise<ApiResponse<PensionerSchemaType>> => {
    const res = await api.post<ApiResponse<PensionerSchemaType>>(
        "/pensioner/pensioner-list/create-pensioner",
        params  
    );

    return res.data;
};
