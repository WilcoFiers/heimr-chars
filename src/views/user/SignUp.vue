<template>
  <div class="login">
    <h3>Sign Up</h3>
    <label>
      E-mail
      <input type="text" v-model="email" autocomplete="off" />
    </label>
    <label>
      Password
      <input type="password" v-model="password" autocomplete="off" />
    </label>
    <button @click="signUp">Sign Up</button>

    <p>
      Already have an account, just
      <router-link to="/sign-in">Sign in</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";

export default Vue.extend({
  name: "SignUp",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async signUp() {
      /*eslint no-console: "off" */
      const { email, password } = this;
      try {
        const auth = firebase.auth();
        const user = await auth.createUserWithEmailAndPassword(email, password);
        console.log("user created", user);
      } catch (e) {
        console.error(e);
      }
    }
  }
});
</script>

<style scoped>
.login {
  margin: 1em;
}
label {
  display: block;
}
</style>
