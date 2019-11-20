import { charactersCol, db, serverTimestamp } from "@/firebase";
import { firestoreAction } from "vuexfire";
import { auth, createID } from "@/firebase";
import { CharacterRuleCol, DbCharacter, CharacterRule } from "@/types";
import { RootModule } from "./types";

export interface CharacterState {
  list: DbCharacter[];
  charId?: string;
  charProps?: DbCharacter;
  rules?: CharacterRule[];
}

export type CharacterModule = RootModule<CharacterState>;

export const character: CharacterModule = {
  state: {
    list: [],
    charId: undefined,
    charProps: undefined,
    rules: undefined
  },

  mutations: {
    setCharId(state, charId) {
      state.charId = charId;
    }
  },

  actions: {
    routeChange({ state, dispatch }, { from }) {
      const charId: string | undefined = from.params.charId;
      if (charId && charId !== state.charId) {
        dispatch("loadCharacter", charId);
      }
    },

    bindRef: firestoreAction((context, { propName, ref, options }) => {
      context.bindFirestoreRef(propName, ref, options);
    }),

    bindCharacterList: firestoreAction(({ bindFirestoreRef }) => {
      if (!auth.currentUser) {
        throw new Error("Trying to load characters without sign-in");
      }
      const { uid } = auth.currentUser;
      const query = charactersCol
        .where("playerID", "==", uid)
        .where("archive", "==", false)
        .orderBy("createdAt", "desc");

      return bindFirestoreRef("list", query);
    }),

    unbindCharacterList: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("list");
    }),

    async loadCharacter({ commit, dispatch }, charId) {
      commit("setCharId", charId);
      dispatch("bindRef", {
        propName: "charProps",
        ref: db.doc(`characters/${charId}`)
      });
      dispatch("bindRef", {
        propName: "rules",
        ref: db.collection(`characters/${charId}/rules`)
      });
    },

    createCharacter(_, { name, race }) {
      const playerID = (auth.currentUser as firebase.User).uid;
      const charId = createID();

      // Use .doc().set() instead of .add() so we can return charId when offline
      charactersCol.doc(charId).set({
        name,
        race,
        playerID,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        archive: false
      });
      return charId;
    },

    updateCharacter(_, { name, race, charId }) {
      const lastUpdated = serverTimestamp();
      return charactersCol.doc(charId).update({ name, race, lastUpdated });
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
};
