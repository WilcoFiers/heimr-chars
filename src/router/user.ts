import SignUp from "@/views/user/SignUp.vue";
import SignIn from "@/views/user/SignIn.vue";
import PasswordReset from "@/views/user/PasswordReset.vue";
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
    path: "/password-reset",
    component: PasswordReset
  },
  {
    path: "/profile",
    component: Profile,
    beforeEnter: AuthGuard
  }
];
