import Vue from "vue";
import Vuex from "vuex";
import { charactersCol, db } from "@/firebase";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { user } from "./user";
import { auth } from "@/firebase";
import { RootState } from "./types";
import { CharacterRuleCol } from "@/types";

Vue.use(Vuex);

function createID(length = 20): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newId: string = "";
  for (let i = 0; i < length; i++) {
    newId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newId;
}

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
    bindRef: firestoreAction(function(context, payload) {
      context.bindFirestoreRef(payload.name, payload.ref, payload.options);
    }),

    unbindRef: firestoreAction(function(context, payload) {
      context.bindFirestoreRef(payload.name, payload.ref, payload.options);
    }),

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
      const charId = createID();

      // Use .doc().set() instead of .add() so we can return charId when offline
      charactersCol.doc(charId).set({
        name,
        race,
        playerID,
        archive: false
      });
      return charId;
    },

    updateCharacter(_, { name, race, charId }) {
      return charactersCol.doc(charId).update({ name, race });
    },

    archiveCharacter(_, charId) {
      return charactersCol.doc(charId).update({ archive: true });
    },

    async addCharacterRule(_, { charId, type, name, domainName }) {
      const rulesRef: CharacterRuleCol = db.collection(
        `characters/${charId}/rules`
      );
      await rulesRef.add({ type, name, domainName });
    }
  }
});
