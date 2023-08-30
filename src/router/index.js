import {createWebHistory, createRouter} from "vue-router";

import routes from "@/router/routes";

import {useAuthStore} from "@/stores/auth";
import {can} from '@/helpers/permissions';

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (!authStore.user) {
        await authStore.getCurrentUser();
    }
    if (!authStore.user) {
        authStore.clearBrowserData();
    }
   
    const requiresRole = to.meta.requiresRole;
    const requiresPermission = to.meta.requiresPermission;
    const requiresAuth = to.meta.requiresAuth;
    const visitor = to.meta.visitor;
    const belongsToOwnerOnly = to.meta.isOwner;
    if ((requiresRole && requiresAuth)) {

        if(authStore.isMasterOrDirector()) {
            next(); 
        } else if (authStore.hasAccessByRole(requiresRole)) {
            next();       
        } else {
            next({
                name: 'dashboard'
            })
        }

    } else if (requiresPermission && requiresAuth) {
        if (can(requiresPermission)) {
            next();
        }else {
            next({name: 'dashboard'});
        }
    } else if (requiresAuth && !authStore.user) {
        next({name: 'home'})
    } else if (visitor && authStore.user) {
        next({name: 'dashboard'})
    }  else {
        next()
    }
})

export default router;
