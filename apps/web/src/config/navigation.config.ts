import {
    LayoutDashboard,
    Users,
    Truck,
    ClipboardList,
    Settings
} from "lucide-react";

import { NavigationItem } from "@/types/navigation.types";
import { ROUTES } from "@/constants/route.constants";

export const navigation: NavigationItem[] = [
    {
        title: "Management",
        href: ROUTES.ADMIN.ACCESS_CONTROL,
        icon: LayoutDashboard,
        roles: ["ADMIN"],
    },
    {
        title: "Dashboard",
        href: ROUTES.ADMIN.DASHBOARD,
        icon: ClipboardList,
        roles: ["ADMIN"],
    },
    {
        title: "SSP-COMPSLIP",
        href: ROUTES.SSP.COMPSLIP,
        icon: ClipboardList,
        roles: ["ADMIN"],
    },
    {
        title: "SSP-COLLECTION",
        href: ROUTES.SSP.COLLECTION,
        icon: ClipboardList,
        roles: ["ADMIN"],
    },
      {
        title: "PENSIONER",
        href: ROUTES.SSP.PENSIONER,
        icon: ClipboardList,
        roles: ["BRANCH","ADMIN"],
    },
    {
        title: "Users",
        href: ROUTES.UNAUTHORIZED, // temporary
        icon: Users,
        roles: ["USER"],
    },
    {
        title: "Settings",
        href: ROUTES.UNAUTHORIZED, // temporary
        icon: Settings,
        roles: ["SUPER_ADMIN"],
    },
];