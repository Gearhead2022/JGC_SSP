import { Router } from "express";
import * as supplementaryController from "./sl-collection.controller";

const router = Router();

router.post(
    "/",
    supplementaryController.createSupplementaryCollection
);

router.get(
    "/active/:pensionerId/all",
    supplementaryController.getActiveLoanByPensionerId
);


export default router;