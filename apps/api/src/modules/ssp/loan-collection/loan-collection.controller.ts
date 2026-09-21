import type {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    createLoanCollectionSchema,
} from "@repo/shared";

import * as service from "./loan-collection.service";

export async function createLoanCollection(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const data =
            createLoanCollectionSchema.parse(
                req.body
            );

        const collection =
            await service.createLoanCollection(
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
        const pensionerId =
            String(req.params.pensionerId);

        const data =
            await service.getActiveLoanByPensionerId(
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

export async function getActiveLoanByPensionerIdAndAccountNo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const pensionerId = String(req.params.pensionerId);
        const accountNumber = String(req.query.accountNumber);

        const data =
            await service.getActiveLoanByPensionerIdAndAccountNo(
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

export async function getLoanCollectionHistory(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const computationSlipId =
            String(
                req.params.computationSlipId
            ).trim();

        const data =
            await service
                .getLoanCollectionHistory(
                    computationSlipId
                );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function postLoanCollection(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const collectionId = String(req.params.collectionId).trim();

        const data = await service.postLoanCollection(collectionId);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}