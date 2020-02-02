<template>
  <v-row>
    <v-col cols="12" md="8" xl="6">
      <slot />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SingleCol"
});
</script>
