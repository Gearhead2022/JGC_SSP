export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    UNAUTHORIZED: "/unauthorized",

    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        ACCESS_CONTROL: "/admin/access-control",
    },

    SSP: {
        COMPSLIP: "/ssp/comp-slip",
        COLLECTION: "/ssp/loan-collection",
        PENSIONER:"/pensioner/pensioner_list",
        SUPPLEMENTARY: "/ssp/supplementary-collection",
    },
} as const;