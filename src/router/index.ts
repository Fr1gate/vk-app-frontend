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
          name: ROUTES_NAMES.PLAYER_BASE.HOME,
          path: "player-base",
          component: () => import("@/layouts/PlayerBaseLayout.vue"),
        },
      ],
    },
  ],
});

export default router;
