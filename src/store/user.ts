import { auth } from "@/firebase";
import { RootModule } from "./types";

export interface UserState {
  signedIn: boolean;
  displayName: string | null;
}

export type UserModules = RootModule<UserState>;

export const user: UserModules = {
  state: {
    signedIn: false,
    displayName: null
  },

  mutations: {
    signedIn: (state, val = true) => (state.signedIn = val),
    setDisplayName: (state, val) => (state.displayName = val)
  },

  actions: {
    async signUp({ dispatch }, { email, password, displayName }) {
      await auth.createUserWithEmailAndPassword(email, password);
      await dispatch("signIn", { email, password });
      const user = auth.currentUser;
      if (user) {
        user.updateProfile({ displayName });
      }
    },

    async emailSignIn({ commit, dispatch }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);
      await dispatch("autoSignIn");

      dispatch("bindCharacterList");
      commit("signedIn", true);
    },

    async autoSignIn({ commit, dispatch }) {
      const user = auth.currentUser;
      if (user) {
        commit("setDisplayName", user.displayName);
      }
      await dispatch("bindCharacterList");
      commit("signedIn", true);
    },

    signOut({ commit }) {
      auth.signOut();
      commit("signedIn", false);
    }
  }
};
