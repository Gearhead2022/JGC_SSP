import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes";
import accessControlRoutes from "@/modules/admin/access-control/access-control.routes";
import dashboardRoutes from "@/modules/admin/dashboard/dashboard.routes";
import sspRoutes from "@/modules/ssp/comp-slip/comp-slip.routes";
import loanCollectionRoutes from "@/modules/ssp/loan-collection/loan-collection.routes";
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

router.use(
    "/ssp/comp-slip",
    authenticate,
    sspRoutes
);

router.use(
    "/ssp/loan-collections",
    loanCollectionRoutes
);

export default router;