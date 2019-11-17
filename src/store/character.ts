import { charactersCol, db } from "@/firebase";
import { firestoreAction } from "vuexfire";
import { auth } from "@/firebase";
import { CharacterRuleCol } from "@/types";
import { RootModule } from "./types";
import { Character } from "../types";

export interface CharacterState {
  list: (Character & { id: string })[];
}

export type CharacterModule = RootModule<CharacterState>;

function createID(length = 20): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newId: string = "";
  for (let i = 0; i < length; i++) {
    newId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newId;
}

export const character: CharacterModule = {
  state: {
    list: []
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

      return bindFirestoreRef("list", query);
    }) as () => Promise<any>,

    unbindCharacters: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("list");
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
};
