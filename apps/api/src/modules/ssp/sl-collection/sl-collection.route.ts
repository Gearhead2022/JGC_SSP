import { Router } from "express";
import * as supplementaryController from "./sl-collection.controller";

const router = Router();

router.get(
    "/active/:pensionerId/all",
    supplementaryController.getActiveLoanByPensionerId
);

// for supplementary module

/**
 * Supplementary collection history
 */
router.get(
    "/:pensionerId",
    supplementaryController
        .getSupplementaryByPensionerIdAndAccountNo
);

/**
 * Post pending supplementary collection
 */
router.patch(
    "/:collectionId/post",
    supplementaryController
        .postSupplementaryCollection
);



export default router;