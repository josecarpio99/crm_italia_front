import {default as PageLogin} from "@/views/pages/auth/login/Main";
import {default as PageRegister} from "@/views/pages/auth/register/Main";
import {default as PageResetPassword} from "@/views/pages/auth/reset-password/Main";
import {default as PageForgotPassword} from "@/views/pages/auth/forgot-password/Main";
import {default as PageNotFound} from "@/views/pages/shared/404/Main";

import {default as PageFAQ} from "@/views/pages/private/FAQ";
import {default as PageDashboard} from "@/views/pages/private/dashboard/Main";
import {default as PageProfile} from "@/views/pages/private/profile/Main";

import {default as PageUsers} from "@/views/pages/private/users/Index";
import {default as PageUsersCreate} from "@/views/pages/private/users/Create";
import {default as PageUsersEdit} from "@/views/pages/private/users/Edit";

import {default as PageCustomers} from "@/views/pages/private/customers/Index";
import {default as PageCustomersShow} from "@/views/pages/private/customers/ShowCustomer";
import {default as PageLeads} from "@/views/pages/private/leads/Index";
import {default as PageLeadsShow} from "@/views/pages/private/leads/ShowLead";

import {default as PageDealsCotizado} from "@/views/pages/private/deals/Cotizado";
import {default as PageDealsOportunidad} from "@/views/pages/private/deals/Oportunidad";
import {default as PageDealsOportunidadShow} from "@/views/pages/private/deals/ShowOportunidad";
import {default as PageDealsCotizadoShow} from "@/views/pages/private/deals/ShowCotizado";

import {default as OpportunitiesBestCustomers} from "@/views/pages/private/reports/OpportunitiesBestCustomers";
import {default as OpportunitiesBestSizes} from "@/views/pages/private/reports/OpportunitiesBestSizes";
import {default as FirmQuotes} from "@/views/pages/private/reports/FirmQuotes";
import {default as Scorecard} from "@/views/pages/private/reports/Scorecard";

import {roles} from "@/stub/roles";

const routes = [
    {
        name: "home",
        path: "/",
        meta: {visitor: true},
        component: PageLogin,
    },
    {
        name: "panel",
        path: "/panel",
        children: [
            {
                name: "dashboard",
                path: "dashboard",
                meta: {requiresAuth: true},
                component: PageDashboard,
            },
            {
                name: "faq",
                path: "faq",
                meta: {requiresAuth: true},
                component: PageFAQ,
            },
            {
                name: "profile",
                path: "profile",
                meta: {requiresAuth: true, isOwner: true},
                component: PageProfile,
            },
            {
                path: "users",
                children: [
                    {
                        name: "users.list",
                        path: "list",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: PageUsers,
                    },
                    {
                        name: "users.create",
                        path: "create",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: PageUsersCreate,
                    },
                    {
                        name: "users.edit",
                        path: ":id/edit",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: PageUsersEdit,
                    },
                ]
            },
            {
                path: "customers",
                children: [
                    {
                        name: "customers.list",
                        path: "list/:id?",
                        meta: {requiresAuth: true},
                        component: PageCustomers,
                    },
                    {
                        name: "customers.show",
                        path: ":id",
                        meta: {requiresAuth: true},
                        component: PageCustomersShow,
                    },
                ]
            },
            {
                path: "leads",
                children: [
                    {
                        name: "leads.list",
                        path: "list/:id?",
                        meta: {requiresAuth: true},
                        component: PageLeads,
                    },
                    {
                        name: "leads.show",
                        path: ":id",
                        meta: {requiresAuth: true},
                        component: PageLeadsShow,
                    },
                ]
            },
            {
                path: "deals",
                children: [
                    {
                        name: "deals.cotizados.list",
                        path: "cotizados/list/:id?",
                        meta: {requiresAuth: true},
                        component: PageDealsCotizado,
                    }
                ]
            },
            {
                path: "deals",
                children: [
                    {
                        name: "deals.oportunidades.list",
                        path: "oportunidades/list/:id?",
                        meta: {requiresAuth: true},
                        component: PageDealsOportunidad,
                    },
                    {
                        name: "deals.oportunidades.show",
                        path: "oportunidades/:id",
                        meta: {requiresAuth: true},
                        component: PageDealsOportunidadShow,
                    },
                    {
                        name: "deals.cotizados.show",
                        path: "cotizados/:id",
                        meta: {requiresAuth: true},
                        component: PageDealsCotizadoShow,
                    },
                ]
            },
            {
                path: "reportes",
                children: [
                    {
                        name: "reports.opportunities_best_customers",
                        path: "oportunidades-mejores-clientes",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: OpportunitiesBestCustomers,
                    },
                    {
                        name: "reports.opportunities_best_sizes",
                        path: "oportunidades-mejores-tamanos",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: OpportunitiesBestSizes
                    },
                    {
                        name: "reports.firm_quotes",
                        path: "cotizaciones-en-firme",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: FirmQuotes
                    },
                    {
                        name: "reports.scorecard",
                        path: "scorecard",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: Scorecard
                    },
                ]
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        meta: {visitor: true},
        component: PageLogin,
    },
    {
        path: "/register",
        name: "register",
        meta: {requiresAuth: false},
        component: PageRegister,
    },
    {
        path: "/reset-password",
        name: "resetPassword",
        meta: {requiresAuth: false},
        component: PageResetPassword,
    },
    {
        path: "/forgot-password",
        name: "forgotPassword",
        meta: {requiresAuth: false},
        component: PageForgotPassword,
    },
    {
        path: "/:pathMatch(.*)",
        name: "notFound",
        meta: {requiresAuth: false},
        component: PageNotFound,
    },
]

export default routes;
