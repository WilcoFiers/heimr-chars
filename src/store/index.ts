import Vue from "vue";
import Vuex from "vuex";
import { charactersRef, db } from "../firebase";
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import { user } from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    characters: []
  },
  modules: { user },
  mutations: {
    ...vuexfireMutations
  },
  actions: {
    bindCharacters: firebaseAction(({ bindFirebaseRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirebaseRef('characters', db.ref('characters'))
    }) as () => Promise<any>,

    unbindCharacters: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef('characters')
    }) as () => void,

    async createCharacter({ commit }, { name }) {
      return await charactersRef.push({ name })
    }
  }
});
