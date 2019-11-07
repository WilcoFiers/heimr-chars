<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <v-content>
      <main class="px-4 pt-4">
        <slot></slot>
      </main>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "./layout/AppBar.vue";
import NavigationDrawer from "./layout/NavigationDrawer.vue";

export default Vue.extend({
  name: "SiteLayout",
  components: {
    AppBar,
    NavigationDrawer
  }
});
</script>
