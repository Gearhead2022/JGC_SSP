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
<<<<<<< HEAD
        PENSIONER:"/pensioner/pensioner_list"
=======
        SUPPLEMENTARY: "/ssp/supplementary-collection",
>>>>>>> 175bdfda472426dda3e630387078fcb96cb269c9
    },
} as const;