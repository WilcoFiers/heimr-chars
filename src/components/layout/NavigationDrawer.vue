<template>
  <v-navigation-drawer app clipped class="drawer" v-model="drawerState">
    <v-list>
      <template v-for="(item, i) in navItems">
        <v-divider v-if="item.divider" :key="i" dark></v-divider>

        <v-list-item v-else :key="i" :to="item.to" active-class="highlighted">
          <v-list-item-action>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { navItems, NavItem } from "./navItems";

type DrawerState = null | boolean;

export default Vue.extend({
  name: "NavigationDrawer",
  props: ["drawer"],
  data(): { drawerState: DrawerState; navItems: NavItem[] } {
    return { drawerState: null, navItems };
  },
  mounted() {
    this.$root.$on("toggleDrawer", () => {
      this.drawerState = !this.drawerState;
    });
  }
});
</script>

<style scoped>
.highlighted {
  background-image: linear-gradient(
    to right,
    var(--v-primary-base),
    var(--v-primary-base) 6px,
    transparent 6px
  );
}
.v-navigation-drawer.drawer {
  background-color: #f1f4e6;
}
</style>
