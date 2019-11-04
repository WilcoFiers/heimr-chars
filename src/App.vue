<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "@/components/layout/AppBar.vue";
import NavigationDrawer from "@/components/layout/NavigationDrawer.vue";

export default Vue.extend({
  name: "HeimrChar",
  components: {
    AppBar,
    NavigationDrawer
  }
});
</script>
