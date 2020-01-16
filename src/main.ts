import Vue from "vue";
import { auth } from "./firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

let app: object;
auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch("autoSignIn", user);
  }
  if (!app) {
    // Prevents mounting multiple times
    app = new Vue({
      router,
      store,
      vuetify: new Vuetify({
        theme: {
          options: {
            customProperties: true
          },
          themes: {
            light: {
              primary: "#437050",
              secondary: "#472515",
              accent: "#52b355",
              error: "#ce1401"
            }
          }
        }
      }),
      render: h => h(App)
    }).$mount("#app");
  }
});
