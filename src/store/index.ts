import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { user, UserState } from "./user";
import { character, CharacterState } from "./character";
import { automata, AutomataState } from "./automata";
import router from "@/router";
import { RootState } from "./types";

const defaultState: RootState = {
  loading: false
};

export interface State extends RootState {
  user: UserState;
  character: CharacterState;
  automata: AutomataState;
}

Vue.use(Vuex);

const store = new Vuex.Store<RootState>({
  state: defaultState,
  modules: { user, character, automata },

  mutations: {
    ...vuexfireMutations,
    setLoading: (state: RootState, val = true) => (state.loading = val)
  }
});

// Expose route change to the store
router.beforeEach((from, to, next) => {
  store.dispatch("routeChange", { from, to });
  next();
});

export default store;
