import Vue from "vue";
import VueRouter from "vue-router";
import { characterRoutes } from "./character";
import { bookRoutes } from "./books";
import { userRoutes } from "./user";
import { toolsRoutes } from "./tools";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import PageNotFound from "@/views/PageNotFound.vue";

Vue.use(VueRouter);

/*
To do webpack chunking, we can use:
component: () => import("../views/About.vue")
*/

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/about",
    component: About
  },
  ...userRoutes,
  ...characterRoutes,
  ...bookRoutes,
  ...toolsRoutes,
  { path: "*", component: PageNotFound }
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

export default router;
