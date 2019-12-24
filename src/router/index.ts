import Vue from "vue";
import VueRouter from "vue-router";
import { SignIn, SignUp } from "@/views/user";
import PageNotFound from "@/views/PageNotFound.vue";
import HeimrBook from "@/views/HeimrBook.vue";
import DomainsBook from "@/views/DomainsBook.vue";
import AuthGuard from "./AuthGuard";
import { characterStepRoutes } from "./character-steps";

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
    path: "/books/domains",
    name: "DomainsBook",
    component: DomainsBook
  },
  {
    path: "/books/*",
    name: "book",
    component: HeimrBook
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
  ...characterStepRoutes,
  { path: "*", component: PageNotFound }
];

const router = new VueRouter({
  routes
});

export default router;
