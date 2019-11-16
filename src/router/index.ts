import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import { SignIn, SignUp } from "@/views/user";
import CharacterList from "@/views/character/CharacterList.vue";
import CharacterNew from "@/views/character/CharacterNew.vue";
import CharacterUpdate from "@/views/character/CharacterUpdate.vue";
import CharacterResources from "@/views/character/CharacterResources.vue";
import CharacterDomains from "@/views/character/CharacterDomains.vue";
import DomainOverview from "@/views/DomainOverview.vue";
import PageNotFound from "@/views/PageNotFound.vue";
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
    path: "/characters/new",
    name: "character-new",
    component: CharacterNew,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId",
    name: "character-update",
    component: CharacterUpdate,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId/domains",
    name: "character-domains",
    component: CharacterDomains,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId/domains/:domain",
    name: "domain-overview",
    component: DomainOverview,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId/resources",
    name: "character-resources",
    component: CharacterResources,
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
  },
  { path: "*", component: PageNotFound }
];

const router = new VueRouter({
  routes
});

export default router;
