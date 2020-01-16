import { User } from "firebase";
import { firestoreAction } from "vuexfire";
import { db, auth, createID, serverTimestamp, automataCol } from "@/firebase";
import {
  NewAutomata,
  Automata,
  GlyphCell,
  NewGlyphCell,
  GlyphCellCol
} from "@/types";
import { RootModule } from "./types";

export interface AutomataState {
  myAutomata: Automata[];
  automataId?: string;
  cells?: GlyphCell[];
  current?: Automata;
}

export type AutomataModule = RootModule<AutomataState>;

export const automata: AutomataModule = {
  state: {
    myAutomata: [],
    automataId: undefined,
    cells: undefined,
    current: undefined
  },

  mutations: {
    setAutomataId(state, automataId) {
      state.automataId = automataId;
    }
  },

  actions: {
    routeChange({ state, dispatch }, { from }) {
      const automataId: string | undefined = from.params.automataId;
      if (automataId && automataId !== state.automataId) {
        dispatch("loadAutomata", automataId);
      }
    },

    bindRefAutomata: firestoreAction(
      ({ bindFirestoreRef }, { propName, ref, options }) => {
        return bindFirestoreRef(propName, ref, options);
      }
    ),

    bindMyAutomata: firestoreAction(({ bindFirestoreRef }) => {
      if (!auth.currentUser) {
        throw new Error("Trying to load automata without sign-in");
      }
      const { uid } = auth.currentUser;
      const query = automataCol.where("playerID", "==", uid);

      return bindFirestoreRef("myAutomata", query);
    }),

    async loadAutomata({ commit, dispatch }, automataId) {
      commit("setAutomataId", automataId);
      dispatch("bindRefAutomata", {
        propName: "current",
        ref: db.doc(`automata/${automataId}`)
      });

      dispatch("bindRefAutomata", {
        propName: "cells",
        ref: db.collection(`automata/${automataId}/cells`),
        options: { wait: true } // Ensure we can tell when the cells aren't loaded
      });
    },

    async createAutomata(
      _,
      { title = "Untitled document", width, height }: NewAutomata
    ) {
      const playerID = (auth.currentUser as User).uid;
      const automataId = createID();
      const createdAt = serverTimestamp();
      const lastUpdated = createdAt;

      // Use .doc().set() instead of .add() so we can return automataId when offline
      await automataCol.doc(automataId).set({
        playerID,
        title,
        width,
        height,
        createdAt,
        lastUpdated
      });
      return automataId;
    },

    async updateAutomata({ state }, newProps: Partial<Automata>) {
      const lastUpdated = serverTimestamp();
      return automataCol
        .doc(state.automataId)
        .update({ lastUpdated, ...newProps });
    },

    async setGlyphCell(
      { state },
      {
        cellKey,
        glyphCell
      }: { cellKey: string; glyphCell: NewGlyphCell | undefined }
    ) {
      const collectionPath = `automata/${state.automataId}/cells`;
      const gridCellCol = db.collection(collectionPath) as GlyphCellCol;

      if (typeof glyphCell === "object") {
        return gridCellCol.doc(cellKey).set(glyphCell);
      } else {
        gridCellCol.doc(cellKey).delete();
      }
    }
  }
};
