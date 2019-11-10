import Vue from "vue";
import Vuex from "vuex";
import { charactersCol } from "@/firebase";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { user } from "./user";
import { auth } from "@/firebase";
import { RootState } from "./types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    characters: []
  },

  modules: { user },

  mutations: {
    ...vuexfireMutations,
    setLoading: (state: RootState, val = true) => (state.loading = val)
  },

  actions: {
    bindCharacters: firestoreAction(({ bindFirestoreRef }) => {
      if (!auth.currentUser) {
        throw new Error("Trying to load characters without sign-in");
      }
      const { uid } = auth.currentUser;
      const query = charactersCol
        .where("playerID", "==", uid)
        .where("archive", "==", false);

      return bindFirestoreRef("characters", query);
    }) as () => Promise<any>,

    unbindCharacters: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("characters");
    }) as () => void,

    async createCharacter(_, { name, race }) {
      const playerID = (auth.currentUser as firebase.User).uid;
      return await charactersCol.add({ name, race, playerID });
    },

    async updateCharacter(_, { name, race, uid }) {
      return await charactersCol.doc(uid).update({ name, race });
    },

    async archiveCharacter(_, { name, race, uid }) {
      return await charactersCol.doc(uid).update({ archive: true });
    }
  }
});
