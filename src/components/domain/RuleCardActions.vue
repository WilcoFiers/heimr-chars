<template>
  <div class="d-flex flex-grow-1">
    <v-btn @click="add">Add</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RuleCardActions",
  props: {
    card: Object
  },
  methods: {
    add() {
      this.$emit("add", this.card);
    }
  }
});
</script>
