import { ROUTES_NAMES } from "@/constants/RoutesNames";
import { usePlayerStore } from "@/stores/player";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: ROUTES_NAMES.HOME,
      // redirect: {
      //   name: ROUTES_NAMES.SYSTEM.LOADING,
      // },
      children: [
        {
          path: "system",
          component: () => import("@/layouts/SystemLayout.vue"),
          children: [
            {
              name: ROUTES_NAMES.SYSTEM.REGISTER,
              path: "register",
              component: () => import("@/pages/auth/RegistrationPage.vue"),
            },
            {
              name: ROUTES_NAMES.SYSTEM.LOADING,
              path: "loading",
              component: () => import("@/pages/auth/LoadingPage.vue"),
            },
          ],
        },
        {
          path: "player-base",
          component: () => import("@/layouts/PlayerBaseLayout.vue"),
          children: [
            {
              name: ROUTES_NAMES.PLAYER_BASE.HOME,
              path: "home",
              component: () => import("@/pages/player_base/PlayerBasePage.vue"),
            },
            {
              name: ROUTES_NAMES.PLAYER_BASE.COLONY,
              path: "colony/:colonyId",
              component: () => import("@/pages/player_base/PlayerColonyPage.vue"),
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  if (!usePlayerStore().player) {
    if (!to.path.match(/^\/system/)) {
      return {
        name: ROUTES_NAMES.SYSTEM.LOADING,
      };
    }
  }
});

export default router;
