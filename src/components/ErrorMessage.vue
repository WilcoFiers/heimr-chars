<template>
  <p class="error--text" v-if="message" role="alert">
    <v-icon class="error--text" small>mdi-alert-circle</v-icon>
    {{ message }}
  </p>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ErrorMessage",
  props: {
    message: {
      type: String
    }
  }
});
</script>
