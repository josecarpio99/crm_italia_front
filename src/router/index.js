import {createWebHistory, createRouter} from "vue-router";

import routes from "@/router/routes";

import {useAuthStore} from "@/stores/auth";

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
    const requiresAuth = to.meta.requiresAuth;
    const belongsToOwnerOnly = to.meta.isOwner;
    if (requiresRole && requiresAuth) {
        
        if (authStore.hasAccessByRole(requiresRole)) {
            next()            
        } else {
            next({
                name: 'profile'
            })
        }

    } else if (requiresAuth && !authStore.user) {
        next({name: 'home'})
    } else if (!requiresAuth && authStore.user) {
        next({name: 'dashboard'})
    } else if (belongsToOwnerOnly) {
        if (authStore.user.is_owner) {
            next()
        } else {
            next({name: 'dashboard'})
        }
    } else {
        next()
    }
})

export default router;
