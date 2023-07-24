import {useAuthStore} from "@/stores/auth";
import {roles} from "@/stub/roles";

export const can = function (name) {
  const authStore = useAuthStore();

  if (name == 'view:customers') {
    if (authStore.isDirector()) {
      return false;
    }

    return true;
  }

  if (name == 'view:reports') {
    if (authStore.hasAccessByRole(roles.SUPERADMIN)) {
      return true;
    }

    return false;
  }

  return false;
}