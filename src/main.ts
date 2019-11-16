import Vue from "vue";
import { auth } from "./firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify/lib";
import { firestorePlugin } from "vuefire";

Vue.use(Vuetify);
Vue.use(firestorePlugin, { wait: true });

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch("autoSignIn", user);
  }
  new Vue({
    router,
    store,
    vuetify: new Vuetify({
      theme: {
        themes: {
          light: {
            // primary: '#3f51b5',
            // secondary: '#b0bec5',
            // accent: '#8c9eff',
            error: "#ce1401"
          }
        }
      }
    }),
    render: h => h(App)
  }).$mount("#app");
});
