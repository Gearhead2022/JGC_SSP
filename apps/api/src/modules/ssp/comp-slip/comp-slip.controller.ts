import { NextFunction, Request, Response } from "express";
import * as compSlipService from "./comp-slip.service";
import { sendSuccess } from "@/lib/http/response";

import { createComputationSlipSchema, } from "@repo/shared";


export async function searchPensionersController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const search = String(req.query.search ?? "");

        const pensioners = await compSlipService.searchPensioners(search);

        sendSuccess(res, pensioners);

    } catch (error) {
        next(error);
    }
}

export async function createComputationSlip(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const data = createComputationSlipSchema.parse(req.body);

        const computationSlip = await compSlipService.createComputationSlip(data);

        return res.status(201).json({
            success: true,
            message:
                "Computation slip created successfully",
            data: computationSlip,
        });
    } catch (error) {
        next(error);
    }
}

export async function getNextControlNumber(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const branchName =
            String(
                req.query.branchName ?? ""
            );

        const data = await compSlipService.getNextControlNumber(branchName);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function getCompslipList(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const branchName = String(
            req.query.branchName ?? ""
        );

        const data =
            await compSlipService.getCompslipList(
                branchName
            );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}