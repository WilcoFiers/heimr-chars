import { Module } from 'vuex'
import { auth } from '../firebase'

export const user: Module<any, any> = {
  state: {
    signedIn: false,
  },

  mutations: {
    signedIn: (state, val = true) => state.signedIn = val,
    setLoading: (state, val = true) => state.loading = val,
  },

  actions: {
    signUp({ commit }) {
      // TODO
    },

    async signIn({ commit, dispatch }, { email, password }) {
      /*eslint no-console: "off" */
      await auth.signInWithEmailAndPassword(email, password);
      dispatch('bindCharacters')
      commit('signedIn', true)
    },

    async autoSignIn({ commit, dispatch }, user) {
      await dispatch('bindCharacters')
      commit('signedIn', true)
    },

    signOut({ commit }) {
      auth.signOut()
      commit('signedIn', false)
    },
  },
};
