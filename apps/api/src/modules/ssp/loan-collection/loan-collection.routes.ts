import { Router } from "express";
import * as controller from "./loan-collection.controller";

const router = Router();

router.post(
    "/",
    controller.createLoanCollection
);

router.get(
    "/active/:pensionerId/all",
    controller.getActiveLoanByPensionerId
);

router.get(
    "/active/:pensionerId",
    controller.getActiveLoanByPensionerIdAndAccountNo
);

router.get(
    "/:computationSlipId/history",
    controller.getLoanCollectionHistory
);

router.patch(
    "/:collectionId/post",
    controller.postLoanCollection
);

export default router;