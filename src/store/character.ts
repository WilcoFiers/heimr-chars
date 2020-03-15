import { firestoreAction } from "vuexfire";
import { User } from "firebase";

import { charactersCol, db, serverTimestamp, auth, createID } from "@/firebase";
import {
  CharacterRuleCol,
  Character,
  CharacterRule,
  NewCharacterRule,
  RaceCard,
  DowntimePeriod,
  CharacterInfo,
  DowntimeItem,
  NewCharacter
} from "@/types";
import { RootModule } from "./types";
import { getRaceCard } from "@/heimr/characterProps";
import { getComputedProps } from "@/heimr/computedProps";
import {
  getDowntimeDefault,
  getDowntimeComputed,
  getCharacterMutations,
  getCharacterRuleMutations
} from "@/heimr/downtime";
import { validatePoints, validateCoppers } from "@/heimr/validateSteps";

export interface CharacterState {
  list: Character[];
  charId?: string;
  charProps?: Character;
  rules?: CharacterRule[];
  selectedDomains: string[];
  downtimePeriods?: DowntimePeriod[];
}

export type CharacterModule = RootModule<CharacterState>;

export const character: CharacterModule = {
  state: {
    list: [],
    charId: undefined,
    charProps: undefined,
    downtimePeriods: undefined,
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
      state.selectedDomains = [];
    }
  },

  actions: {
    routeChange({ state, dispatch }, { from }) {
      const charId: string | undefined = from.params.charId;
      if (charId && charId !== state.charId) {
        dispatch("loadCharacter", charId);
      }
    },

    bindRefCharacter: firestoreAction((context, { propName, ref, options }) => {
      return context.bindFirestoreRef(propName, ref, options);
    }),

    unbindRefCharacter: firestoreAction(
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

    loadCharacter({ commit, dispatch }, charId) {
      commit("setCharId", charId);
      commit("resetSelectedDomains");
      if (charId === "new") {
        return dispatch("unbindRefCharacter", ["charProps", "rules"]);
      }

      return Promise.all([
        dispatch("bindRefCharacter", {
          propName: "charProps",
          ref: db.doc(`characters/${charId}`)
        }),
        dispatch("bindRefCharacter", {
          propName: "rules",
          ref: db.collection(`characters/${charId}/rules`)
        }),
        dispatch("bindRefCharacter", {
          propName: "downtimePeriods",
          ref: db.collection(`characters/${charId}/downtimePeriods`)
        })
      ]);
    },

    createCharacter(_, { name, race }) {
      const playerID = (auth.currentUser as User).uid;
      const charId = createID();

      // Use .doc().set() instead of .add() so we can return charId when offline
      // Don't "await" this so we can return charId
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

    updateCharacter({ state }, newProps: Partial<NewCharacter>) {
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

    updateCharacterRule({ state }, charRule: CharacterRule) {
      const characterRulePath = `characters/${state.charId}/rules/${charRule.id}`;
      return db.doc(characterRulePath).update(charRule);
    },

    newDowntimePeriod({ state, getters }) {
      let newRuleId = 1;
      if (Array.isArray(state.downtimePeriods)) {
        newRuleId =
          1 +
          state.downtimePeriods.reduce(
            (val: number, { id }): number => Math.max(val, parseInt(id)),
            0
          );
      }
      const characterRulePath = `characters/${state.charId}/downtimePeriods/${newRuleId}`;
      const downtimePeriod = getDowntimeDefault(
        getters.characterInfo as CharacterInfo
      );

      db.doc(characterRulePath).set(downtimePeriod);
      return newRuleId;
    },

    updateDowntimePeriod({ state }, charUpdate: Partial<CharacterRule>) {
      if (!charUpdate.id) {
        throw new Error("no id for updating downtime");
      }
      const dataCopy = { ...charUpdate };
      delete dataCopy.id;
      const characterRulePath = `characters/${state.charId}/downtimePeriods/${charUpdate.id}`;
      return db.doc(characterRulePath).update(dataCopy);
    },

    addDowntimeItem(
      { state },
      {
        downtimeId,
        propName,
        downtimeItem
      }: {
        downtimeId: string;
        propName: "actions" | "exchanges";
        downtimeItem: DowntimeItem;
      }
    ) {
      const downtimePeriod = (state.downtimePeriods || []).find(
        ({ id }) => id === downtimeId
      );
      if (!downtimePeriod) {
        throw new Error("Unable to add item, downtime period is undefined");
      }
      const propCopy = downtimePeriod[propName].concat();
      propCopy.push(downtimeItem);

      const characterRulePath = `characters/${state.charId}/downtimePeriods/${downtimeId}`;
      return db.doc(characterRulePath).update({ [propName]: propCopy });
    },

    removeDowntimeItem(
      { state },
      {
        downtimeId,
        propName,
        index
      }: {
        downtimeId: string;
        propName: "actions" | "exchanges";
        index: number;
      }
    ) {
      const downtimePeriod = (state.downtimePeriods || []).find(
        ({ id }) => id === downtimeId
      );
      if (!downtimePeriod) {
        throw new Error("Unable to add item, downtime period is undefined");
      }
      const propCopy = downtimePeriod[propName].concat();
      propCopy.splice(index, 1);

      const characterRulePath = `characters/${state.charId}/downtimePeriods/${downtimeId}`;
      return db.doc(characterRulePath).update({ [propName]: propCopy });
    },

    completeDowntimePeriod({ dispatch, state }, id) {
      const { downtimePeriods } = state;
      const downtimePeriod = downtimePeriods?.find(dtp => dtp.id === id);
      if (!downtimePeriod) {
        throw new Error(`Did not find downtime period with id ${id}.`);
      }
      if (downtimePeriod.complete !== false) {
        throw new Error("Downtime period is undefined or already complete");
      }

      const downtimeComputed = getDowntimeComputed(downtimePeriod);
      const charUpdate = getCharacterMutations(downtimeComputed);
      const charRuleUpdates = getCharacterRuleMutations(downtimeComputed);

      // TODO: Figure out how to batch these so they all succeed at the same time
      return Promise.all([
        dispatch("updateDowntimePeriod", { id, complete: true }),
        dispatch("updateCharacter", charUpdate),
        ...charRuleUpdates.map(charRuleUpdate => {
          return dispatch("updateCharacterRule", charRuleUpdate);
        })
      ]);
    }
  }
};
