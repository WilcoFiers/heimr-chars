import SignUp from "@/views/user/SignUp.vue";
import SignIn from "@/views/user/SignIn.vue";
import Profile from "@/views/user/Profile.vue";
import AuthGuard from "./AuthGuard";

export const userRoutes = [
  {
    path: "/sign-in",
    component: SignIn
  },
  {
    path: "/sign-up",
    component: SignUp
  },
  {
    path: "/profile",
    component: Profile,
    beforeEnter: AuthGuard
  }
];
