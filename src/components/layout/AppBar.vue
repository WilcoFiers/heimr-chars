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
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "AppBar",
  methods: {
    toggleDrawer() {
      this.$root.$emit("toggleDrawer");
    }
  }
});
</script>
