import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";
import { user, UserState } from "./user";
import { character, CharacterState } from "./character";

import { RootState } from "./types";

Vue.use(Vuex);

const defaultState: RootState = {
  loading: false
};

export interface State extends RootState {
  user: UserState;
  character: CharacterState;
}

export default new Vuex.Store<RootState>({
  state: defaultState,
  modules: { user, character },

  mutations: {
    ...vuexfireMutations,
    setLoading: (state: RootState, val = true) => (state.loading = val)
  }
});
