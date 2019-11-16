<template>
  <v-app-bar app dark clipped-left>
    <v-app-bar-nav-icon
      @click.stop="toggleDrawer"
      aria-label="Toggle navbar"
    ></v-app-bar-nav-icon>

    <span class="title ml-3 mr-5">
      <v-icon left large>mdi-account-group</v-icon>Heimr LARP&nbsp;
      <span class="font-weight-light">Unofficial App</span>
    </span>
    <v-spacer></v-spacer>

    <v-btn v-if="!signedIn" @slick="signIn">Sign In</v-btn>
    <span v-else>
      <v-btn to="/profile" class="mr-3">
        <v-icon left>mdi-account</v-icon>
        {{ displayName }}
      </v-btn>

      <v-btn @click="signOut">
        <v-icon left>mdi-exit-to-app</v-icon>Sign Out
      </v-btn>
    </span>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { RootState } from "@/store/types";

export default Vue.extend({
  name: "AppBar",
  computed: mapState({
    signedIn: state => (state as RootState).user.signedIn,
    displayName: state => (state as RootState).user.displayName
  }),
  methods: {
    toggleDrawer() {
      this.$root.$emit("toggleDrawer");
    },
    signIn() {
      this.$router.push("/sign-in");
    },
    signOut() {
      this.$store.dispatch("signOut");
      this.$router.replace("sign-in");
    }
  }
});
</script>
