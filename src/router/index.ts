import { ROUTES_NAMES } from "@/constants/RoutesNames";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: ROUTES_NAMES.HOME,
      redirect: {
        name: ROUTES_NAMES.AUTH.INDEX,
      },
      children: [
        {
          path: "auth",
          component: () => import("@/layouts/SystemLayout.vue"),
          children: [
            {
              name: ROUTES_NAMES.AUTH.INDEX,
              path: "",
              component: () => import("@/pages/auth/AuthPage.vue"),
            },
            {
              name: ROUTES_NAMES.AUTH.LOGIN,
              path: "login",
              component: () => import("@/pages/auth/LoginPage.vue"),
            },
            {
              name: ROUTES_NAMES.AUTH.REGISTER,
              path: "register",
              component: () => import("@/pages/auth/RegistrationPage.vue"),
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

export default router;
