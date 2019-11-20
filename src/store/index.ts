import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";
import { user, UserState } from "./user";
import { character, CharacterState } from "./character";
import router from "@/router";
import { RootState } from "./types";

const defaultState: RootState = {
  loading: false
};

export interface State extends RootState {
  user: UserState;
  character: CharacterState;
}

Vue.use(Vuex);

const store = new Vuex.Store<RootState>({
  state: defaultState,
  modules: { user, character },

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
