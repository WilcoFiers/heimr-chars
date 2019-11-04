<template>
  <div class="login">
    <h3>Sign in</h3>
    <p v-if="message">{{ message }}</p>
    <label>
      E-mail
      <input type="text" v-model="email" />
    </label>
    <label>
      Password
      <input type="password" v-model="password" />
    </label>
    <button @click="signIn">Sign in</button>
    <p>
      Don't have an account, just
      <router-link to="/sign-up">Sign up</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
      message: ""
    };
  },
  methods: {
    async signIn() {
      const { email, password } = this;
      try {
        await this.$store.dispatch("signIn", { email, password });
        this.$router.push("/");
      } catch (e) {
        this.message = e.message;
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