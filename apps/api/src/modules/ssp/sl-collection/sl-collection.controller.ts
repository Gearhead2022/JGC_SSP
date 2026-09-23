import type {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    createLoanCollectionSchema,
    createSupplementaryCollectionSchema,
} from "@repo/shared";

import * as loanService from "../loan-collection/loan-collection.service";
import * as supplementaryService from "./sl-collection.service";

export async function createSupplementaryCollection(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const data =
            createSupplementaryCollectionSchema.parse(
                req.body
            );

        const collection =
            await supplementaryService.createSupplementaryCollection(
                data
            );

        return res.status(201).json({
            success: true,
            message:
                "Loan collection posted successfully",
            data: collection,
        });
    } catch (error) {
        next(error);
    }
}

export async function getActiveLoanByPensionerId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const pensionerId = String(req.params.pensionerId);

        const data =
            await loanService.getActiveLoanByPensionerId(
                pensionerId
            );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}