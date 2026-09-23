import { Router } from "express";
import * as controller from "./comp-slip.controller";

const router = Router();

router.get(
    "/pensioners",
    controller.searchPensionersController
);

router.post(
    "/calculate",
    controller.calculateComputationSlip
);

router.post(
    "/",
    controller.createComputationSlip
);

router.get(
    "/next-control-number",
    controller.getNextControlNumber
);

router.get(
    "/",
    controller.getCompslipList
);

export default router;