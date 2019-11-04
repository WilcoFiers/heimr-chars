<template>
  <div id="nav">
    <router-link to="/">Home</router-link>&nbsp;|
    <span v-if="signedIn">
      <router-link to="/about">About</router-link>&nbsp;|
      <router-link to="/characters">My Characters</router-link>&nbsp;|
      <a href="#" @click="signOut">Sign out</a>
    </span>
    <span v-else>
      <router-link to="/sign-in">Sign in</router-link>&nbsp;|
      <router-link to="/sign-up">Sign up</router-link>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { RootState } from "@/store/types";

export default Vue.extend({
  data() {
    return {};
  },
  computed: mapState({
    signedIn: state => (state as RootState).user.signedIn
  }),
  methods: {
    async signOut() {
      this.$store.dispatch("signOut");
      this.$router.replace("sign-in");
    }
  }
});
</script>
