import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes";
import accessControlRoutes from "@/modules/admin/access-control/access-control.routes";
import dashboardRoutes from "@/modules/admin/dashboard/dashboard.routes";
import sspRoutes from "@/modules/ssp/comp-slip/comp-slip.routes";
import loanCollectionRoutes from "@/modules/ssp/loan-collection/loan-collection.routes";
import PensionerListRoutes from "@/modules/pensioner/pensioner_list/pensioner_list.routes";
import supplementaryCollectionRoutes from "@/modules/ssp/sl-collection/sl-collection.route";
import { authenticate } from '@/middleware/authenticate.middleware';

const router = Router();

router.use("/auth", authRoutes);

router.use(
    "/admin/access-control",
    authenticate,
    accessControlRoutes
);

router.use(
    "/admin/dashboard",
    authenticate,
    dashboardRoutes
);

router.use("/ssp/comp-slip",authenticate,sspRoutes);

router.use("/ssp/loan-collections",loanCollectionRoutes);

router.use("/pensioner/pensioner-list",authenticate,PensionerListRoutes);

router.use(
    "/ssp/sl-collections",
    supplementaryCollectionRoutes
);


export default router;