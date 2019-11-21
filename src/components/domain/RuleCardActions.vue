<template>
  <div class="flex-grow-1">
    <div class=" d-flex" v-if="!multiple">
      <v-btn @click="add" v-if="hasAdd">
        <v-icon left>mdi-plus</v-icon>Add
      </v-btn>
      <v-spacer />
      <v-btn @click="remove" v-if="hasRemove">
        <v-icon left>mdi-minus</v-icon>Remove
      </v-btn>
    </div>

    <div class="d-flex justify-space-between" v-else>
      <v-btn @click="add" v-if="hasAdd">
        <v-icon left>mdi-plus</v-icon>Add
      </v-btn>
      <span class="py-2"
        >Quantity: <strong>{{ quantity }}</strong></span
      >

      <v-btn @click="remove" :disabled="!hasRemove">
        <v-icon left>mdi-minus</v-icon>Remove
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RuleCardActions",
  props: {
    ruleCard: Object,
    quantity: Number,
    multiple: Boolean,
    removable: Boolean
  },
  computed: {
    hasAdd(): boolean {
      return this.multiple === true || this.quantity <= 0;
    },
    hasRemove(): boolean {
      return this.removable || this.quantity > 0;
    }
  },
  methods: {
    add() {
      this.$emit("add", this.ruleCard);
    },
    remove() {
      this.$emit("remove", this.ruleCard);
    }
  }
});
</script>
