import Vue from "vue";
import Vuex from "vuex";
import { charactersCol } from "@/firebase";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { user } from "./user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    characters: []
  },
  modules: { user },
  mutations: {
    ...vuexfireMutations,
    setLoading: (state, val = true) => (state.loading = val)
  },
  actions: {
    bindCharacters: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef("characters", charactersCol);
    }) as () => Promise<any>,

    unbindCharacters: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("characters");
    }) as () => void,

    async createCharacter({ commit }, { name }) {
      return await charactersCol.add({ name });
    }
  }
});
