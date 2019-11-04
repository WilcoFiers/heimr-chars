import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import { SignIn, SignUp } from "@/views/user";
import CharacterList from "@/views/CharacterList.vue";
import AuthGuard from "./AuthGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp
  },
  {
    path: "/characters",
    name: "character-list",
    component: CharacterList,
    beforeEnter: AuthGuard
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import("../views/About.vue") /* webpackChunkName: "about" */,
    beforeEnter: AuthGuard
  }
];

const router = new VueRouter({
  routes
});

export default router;
