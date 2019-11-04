import Vue from "vue";
import { auth } from "./firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

// Vue.config.productionTip = false;

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch("autoSignIn", user);
  }
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
});
