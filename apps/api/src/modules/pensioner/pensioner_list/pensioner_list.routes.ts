import { Router } from "express";
import * as PensionerRouteList from "./pensioner_list.controller";
import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";


const router = Router();

router.use(authenticate);

router.get("/display-pensioner-list", PensionerRouteList.getPensionerController);
router.post("/create-pensioner",authorize({roles:["ADMIN","BRANCH"]}),PensionerRouteList.createPensionerController);




export default router;

