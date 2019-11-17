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

    <v-btn v-if="!signedIn" to="/sign-in">Sign In</v-btn>
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
import { State } from "@/store";

export default Vue.extend({
  name: "AppBar",

  computed: mapState({
    signedIn: (state: State) => state.user.signedIn,
    displayName: (state: State) => state.user.displayName
  }),

  methods: {
    toggleDrawer() {
      this.$root.$emit("toggleDrawer");
    },
    signOut() {
      this.$store.dispatch("signOut");
      this.$router.push("sign-in");
    }
  }
});
</script>
