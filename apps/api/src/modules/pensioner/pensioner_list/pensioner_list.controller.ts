import type { NextFunction, Request, Response } from "express";
import * as PensionerService from "./pensioner_list.service";
import { sendSuccess } from "@/lib/http/response";





export async function getPensionerController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await PensionerService.getPensioners({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,

            search:
                typeof req.query.search === "string"
                    ? req.query.search.trim()
                    : undefined,
        
        });

        sendSuccess(res, result.data,{
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
}




export async function createPensionerController(req:Request,res:Response){
    try{
        const data = await PensionerService.createPensioner(req.body);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occured in controller ${error}`);
    }
}