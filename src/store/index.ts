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

    createCharacter(_, { name, race }) {
      const playerID = (auth.currentUser as firebase.User).uid;
      return charactersCol.add({ name, race, playerID });
    },

    updateCharacter(_, { name, race, uid }) {
      return charactersCol.doc(uid).update({ name, race });
    },

    archiveCharacter(_, { uid }) {
      return charactersCol.doc(uid).update({ archive: true });
    },

    async addCharacterRule(_, { rule, charId }) {
      const char = this.state.characters.find(
        ({ id }: { id: string }) => id.substr(0, 6) === charId
      );
      // TODO, store char in state somehow, probably with bind/unbind
      const charDoc = await charactersCol.doc(char.id);
      try {
        const out = await charDoc.collection("rules").add({
          type: rule.type,
          name: rule.name
        });
      } catch (e) {
        console.log("failed to add rule", rule);
        console.error(e);
      }
    }
  }
});
