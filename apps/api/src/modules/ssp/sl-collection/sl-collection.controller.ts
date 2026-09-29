import type {
    Request,
    Response,
    NextFunction,
} from "express";

import * as loanService from "../loan-collection/loan-collection.service";
import * as supplementaryService from "./sl-collection.service";

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

// for supplementary module

export async function getSupplementaryByPensionerIdAndAccountNo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const pensionerId =
            String(
                req.params.pensionerId
            ).trim();

        const accountNumber =
            String(
                req.query.accountNumber ??
                ""
            ).trim();

        if (!accountNumber) {
            throw new Error(
                "Loan account number is required"
            );
        }

        const data =
            await supplementaryService
                .getSupplementaryByPensionerIdAndAccountNo(
                    pensionerId,
                    accountNumber
                );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function postSupplementaryCollection(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const collectionId =
            String(
                req.params.collectionId
            ).trim();

        const data =
            await supplementaryService
                .postSupplementaryCollection(
                    collectionId
                );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}