<template>
  <v-navigation-drawer app clipped color="grey lighten-4" v-model="drawerState">
    <v-list>
      <template v-for="(item, i) in navItems">
        <v-divider v-if="item.divider" :key="i" dark></v-divider>

        <v-list-item v-else :key="i" @click="goto(item.to)">
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

type DrawerState = null | boolean;
type Link = { text: string; to: string; icon: string };
type Divider = { divider: true };
type NavItem = Link | Divider;

const navItems: NavItem[] = [
  {
    text: "Characters",
    to: "/characters",
    icon: "account-search"
  },
  {
    text: "Events",
    to: "/events",
    icon: "calendar-month"
  },
  {
    text: "Profile",
    to: "/profile",
    icon: "card-bulleted"
  },
  {
    divider: true
  },
  {
    text: "Settings",
    to: "/settings",
    icon: "settings"
  },
  {
    text: "Help",
    to: "/help",
    icon: "help"
  }
];

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
  },
  methods: {
    goto(to: string) {
      this.$router.push(to);
    }
  }
});
</script>
