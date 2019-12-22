import { charactersCol, db, serverTimestamp } from "@/firebase";
import { firestoreAction } from "vuexfire";
import { auth, createID } from "@/firebase";
import {
  CharacterRuleCol,
  Character,
  CharacterRule,
  NewCharacterRule,
  RaceCard
} from "@/types";
import { RootModule } from "./types";
import {
  getPointsSpent,
  getCashSpent,
  getMonthlySavings
} from "@/heimr/characterCardProps";
import {
  getRaceCard,
  getCharacterProps,
  CharacterProps
} from "@/heimr/characterProps";

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

    characterRuleStates({ charProps, rules = [] }) {
      const characterProps = getCharacterProps(charProps);
      const pointsSpent = getPointsSpent(rules);
      const dormantSpent = getPointsSpent(rules, true);
      const coppersSpent = getCashSpent(rules);
      const monthlySavings = charProps
        ? getMonthlySavings(charProps, rules || [])
        : 0;
      const pointsLeft = characterProps.startingPoints - pointsSpent;
      const dormantLeft = characterProps.freeDormant - dormantSpent;
      const unspentCoppers = characterProps.startingCash - coppersSpent;

      return {
        pointsSpent,
        coppersSpent,
        dormantSpent,
        monthlySavings,
        pointsLeft,
        dormantLeft,
        unspentCoppers,
        ...characterProps
      };
    },

    stepStates(state) {
      let origins = "invalid",
        domains = "invalid",
        points = "invalid",
        coppers = "invalid";
      if (state.charProps?.name && state.charProps?.race) {
        origins = "valid";
      }
      const rules = state.rules || [];
      if (rules.length > 0 || state.selectedDomains.length > 0) {
        domains = "valid";
      }
      const pointsSpent = getPointsSpent(rules);
      if (pointsSpent >= 15) {
        points = "valid";
        coppers = "valid";
      }
      return { origins, domains, points, coppers };
    }
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
        return dispatch("unbindRef", ["charProps", "rules"]);
      }

      dispatch("bindRef", {
        propName: "charProps",
        ref: db.doc(`characters/${charId}`)
      });

      dispatch("bindRef", {
        propName: "rules",
        ref: db.collection(`characters/${charId}/rules`)
      });
    },

    async createCharacter(_, { name, race }) {
      const playerID = (auth.currentUser as firebase.User).uid;
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
