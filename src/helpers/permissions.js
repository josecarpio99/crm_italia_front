import {useAuthStore} from "@/stores/auth";

export const can = function (name) {
  const authStore = useAuthStore();

  if (name == 'view:customers') {
    if (authStore.isDirector()) {
      return false;
    }

    return true;
  }

  return false;
}