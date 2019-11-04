import Vue from "vue";
import { auth } from './firebase';
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Vue.config.productionTip = false;

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('autoSignIn', user)
  }
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
})


