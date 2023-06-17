import {default as PageLogin} from "@/views/pages/auth/login/Main";
import {default as PageRegister} from "@/views/pages/auth/register/Main";
import {default as PageResetPassword} from "@/views/pages/auth/reset-password/Main";
import {default as PageForgotPassword} from "@/views/pages/auth/forgot-password/Main";
import {default as PageNotFound} from "@/views/pages/shared/404/Main";

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

import {roles} from "@/stub/roles";

const routes = [
    {
        name: "home",
        path: "/",
        meta: {requiresAuth: false},
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
                        path: "list",
                        meta: {requiresAuth: true},
                        component: PageCustomers,
                    },
                    {
                        name: "customers.show",
                        path: ":id",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: PageCustomersShow,
                    },
                ]
            },
            {
                path: "leads",
                children: [
                    {
                        name: "leads.list",
                        path: "list",
                        meta: {requiresAuth: true},
                        component: PageLeads,
                    },
                    {
                        name: "leads.show",
                        path: ":id",
                        meta: {requiresAuth: true, requiresRole: roles.SUPERADMIN},
                        component: PageLeadsShow,
                    },
                ]
            },
            {
                path: "deals",
                children: [
                    {
                        name: "deals.cotizados.list",
                        path: "cotizados/list",
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
                        path: "oportunidades/list",
                        meta: {requiresAuth: true},
                        component: PageDealsOportunidad,
                    },
                    {
                        name: "deals.oportunidades.show",
                        path: "oportunidades/:id",
                        meta: {requiresAuth: true},
                        component: PageDealsOportunidadShow,
                    },
                ]
            },
        ]
    },
    {
        path: "/login",
        name: "login",
        meta: {requiresAuth: false},
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
        path: "/:catchAll(.*)",
        name: "notFound",
        meta: {requiresAuth: false},
        component: PageNotFound,
    },
]

export default routes;
