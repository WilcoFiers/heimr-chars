<template>
  <v-app-bar app clipped-left dark class="primary">
    <v-app-bar-nav-icon
      v-if="isMobile"
      @click.stop="toggleDrawer"
      aria-label="Toggle navbar"
    ></v-app-bar-nav-icon>

    <router-link
      class="title ml-2 unstyled"
      v-if="isMobile && backButton"
      :to="backButton && backButton.to"
    >
      <v-icon left v-text="`mdi-${backButton.icon}`"></v-icon>Heimr&nbsp;
      <span class="font-weight-light" v-text="backButton.text" />
    </router-link>

    <router-link to="/" class="title ml-2 unstyled" v-else>
      <v-icon left>mdi-account-group</v-icon>Heimr&nbsp;
      <span class="font-weight-light">Unofficial App</span>
    </router-link>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { State } from "@/store";
import { navItems, NavItem } from "./navItems";

export default Vue.extend({
  name: "AppBar",

  computed: mapState({
    signedIn: (state: State, _) => state.user.signedIn,
    displayName: (state: State) => state.user.displayName,
    isMobile(): boolean {
      // @ts-ignore
      return !this.$vuetify.breakpoint.lg;
    },

    backButton(): NavItem | undefined {
      // @ts-ignore
      const path: string = this.$route.path;
      return navItems.find(item => {
        if ("to" in item) {
          return path !== item.to && path.indexOf(item.to) === 0;
        }
        return false;
      });
    }
  }),

  methods: {
    toggleDrawer() {
      this.$root.$emit("toggleDrawer");
    },
    signOut() {
      this.$store.dispatch("signOut");
      this.$router.push("/sign-in");
    }
  }
});
</script>

<style lang="scss">
a.unstyled {
  color: inherit !important;
  text-decoration: none;
}
</style>
