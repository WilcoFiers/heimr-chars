import Vue from "vue";
import { auth } from "./firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch("autoSignIn", user);
  }
  new Vue({
    router,
    store,
    vuetify: new Vuetify({}),
    render: h => h(App)
  }).$mount("#app");
});
