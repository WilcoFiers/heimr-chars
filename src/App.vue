<template>
  <div id="app">
    <SiteNav />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SiteNav from "./components/layout/SiteNav.vue";

export default Vue.extend({
  name: "HeimrCharacters",
  components: { SiteNav }
});
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
