import SignUp from "@/views/user/SignUp.vue";
import SignIn from "@/views/user/SignIn.vue";
import PasswordReset from "@/views/user/PasswordReset.vue";
import Account from "@/views/user/Account.vue";
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
    path: "/account",
    component: Account,
    beforeEnter: AuthGuard
  }
];
