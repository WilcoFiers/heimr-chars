import { firestoreAction } from "vuexfire";
import { User } from "firebase";

import { charactersCol, db, serverTimestamp, auth, createID } from "@/firebase";
import {
  CharacterRuleCol,
  Character,
  CharacterRule,
  NewCharacterRule,
  RaceCard
} from "@/types";
import { RootModule } from "./types";
import { getRaceCard } from "@/heimr/characterProps";
import { getComputedProps } from "@/heimr/computedProps";
import { validatePoints, validateCoppers } from "@/heimr/validateSteps";

export interface CharacterState {
  list: Character[];
  charId?: string;
  charProps?: Character;
  rules?: CharacterRule[];
  selectedDomains: string[];
}

export type CharacterModule = RootModule<CharacterState>;

export const character: CharacterModule = {
  state: {
    list: [],
    charId: undefined,
    charProps: undefined,
    rules: undefined,
    selectedDomains: []
  },

  getters: {
    raceCard({ charProps }): RaceCard | undefined {
      if (!charProps) {
        return undefined;
      }
      return getRaceCard(charProps);
    },

    characterInfo({ charProps, rules = [] }) {
      return getComputedProps(charProps, rules);
    },

    stepStates({ charProps, rules = [], selectedDomains }, { characterInfo }) {
      let origins = false;
      let domains = false;
      if (charProps?.name && charProps?.race) {
        origins = true;
      }

      if (rules.length > 0 || selectedDomains.length > 0) {
        domains = true;
      }

      const points = validatePoints(characterInfo).length === 0;
      const coppers = validateCoppers(characterInfo).length === 0;
      return { origins, domains, points, coppers };
    }
  },

  mutations: {
    setCharId(state, charId) {
      state.charId = charId;
    },

    toggleSelectedDomain({ selectedDomains }, domainName: string) {
      const index = selectedDomains.indexOf(domainName);
      if (index === -1) {
        selectedDomains.push(domainName);
      } else {
        selectedDomains.splice(index, 1);
      }
    },

    resetSelectedDomains(state) {
      const domains: Set<string> = new Set();
      if (state.rules) {
        state.rules.forEach(({ domainName }) => domains.add(domainName));
      }
      state.selectedDomains = Array.from(domains);
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
      return context.bindFirestoreRef(propName, ref, options);
    }),

    unbindRef: firestoreAction(
      ({ unbindFirestoreRef }, refs: string | string[]) => {
        refs = Array.isArray(refs) ? refs : [refs];
        refs.forEach(ref => unbindFirestoreRef(ref));
      }
    ),

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
      if (charId === "new") {
        return dispatch("unbindRef", ["charProps", "rules"]).then(() =>
          commit("resetSelectedDomains")
        );
      }

      dispatch("bindRef", {
        propName: "charProps",
        ref: db.doc(`characters/${charId}`)
      });

      dispatch("bindRef", {
        propName: "rules",
        ref: db.collection(`characters/${charId}/rules`)
      }).then(() => commit("resetSelectedDomains"));
    },

    async createCharacter(_, { name, race }) {
      const playerID = (auth.currentUser as User).uid;
      const charId = createID();

      // Use .doc().set() instead of .add() so we can return charId when offline
      await charactersCol.doc(charId).set({
        name,
        race,
        playerID,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        archive: false
      });
      return charId;
    },

    updateCharacter({ state }, newProps: Character) {
      const lastUpdated = serverTimestamp();
      return charactersCol
        .doc(state.charId)
        .update({ lastUpdated, ...newProps });
    },

    archiveCharacter({ state }) {
      return charactersCol.doc(state.charId).update({ archive: true });
    },

    addCharacterRule({ state }, ruleCard: NewCharacterRule) {
      const rulesRef: CharacterRuleCol = db.collection(
        `characters/${state.charId}/rules`
      );
      return rulesRef.add(ruleCard);
    },

    removeCharacterRule({ state }, id: string) {
      const characterRulePath = `characters/${state.charId}/rules/${id}`;
      return db.doc(characterRulePath).delete();
    },

    changeCharacterRule({ state }, charRule: CharacterRule) {
      const characterRulePath = `characters/${state.charId}/rules/${charRule.id}`;
      return db.doc(characterRulePath).update(charRule);
    }
  }
};
