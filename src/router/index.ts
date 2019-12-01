import Vue from "vue";
import VueRouter from "vue-router";
import { SignIn, SignUp } from "@/views/user";
import PageNotFound from "@/views/PageNotFound.vue";
import AuthGuard from "./AuthGuard";
import { characterRoutes } from "./characters";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/characters"
  },
  {
    path: "/sign-in",
    component: SignIn
  },
  {
    path: "/sign-up",
    component: SignUp
  },
  {
    path: "/about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import("../views/About.vue") /* webpackChunkName: "about" */,
    beforeEnter: AuthGuard
  },
  ...characterRoutes,
  { path: "*", component: PageNotFound }
];

const router = new VueRouter({
  routes
});

export default router;
