<template>
  <v-container>
    <v-row class="justify-center">
      <v-col :md="6">
        <v-form @submit.prevent="signIn">
          <h1>Sign In</h1>
          <v-row v-if="message">
            <p class="red--text text--darken-3">
              <v-icon class="red--text text--darken-3" small
                >mdi-alert-circle</v-icon
              >
              {{ message }}
            </p>
          </v-row>
          <v-row>
            <v-text-field label="E-mail" v-model="email" required />
          </v-row>
          <v-row>
            <v-text-field
              label="Password"
              v-model="password"
              type="password"
              required
            />
          </v-row>
          <v-row>
            <v-btn type="submit">Sign in</v-btn>
          </v-row>
          <v-row>
            <p class="py-5">
              Don't have an account, just
              <router-link to="/sign-up">Sign up</router-link>
            </p>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
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
        await this.$store.dispatch("emailSignIn", { email, password });
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
