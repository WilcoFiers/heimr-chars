import { Module } from "vuex";
import { auth } from "@/firebase";

export const user: Module<any, any> = {
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

      dispatch("bindCharacters");
      commit("signedIn", true);
    },

    async autoSignIn({ commit, dispatch }) {
      const user = auth.currentUser;
      if (user) {
        commit("setDisplayName", user.displayName);
      }
      await dispatch("bindCharacters");
      commit("signedIn", true);
    },

    signOut({ commit }) {
      auth.signOut();
      commit("signedIn", false);
    }
  }
};
