<template>
  <div class="mt-3 d-flex justify-space-between">
    <v-btn
      outlined
      v-if="!ownsOtherLevel"
      :disabled="!canAdd"
      @click="cardAction('addRule')"
    >
      <v-icon left>mdi-plus</v-icon>Add
    </v-btn>
    <v-btn
      outlined
      v-else
      :disabled="!canChangeLevel"
      @click="cardAction('changeRuleLevel')"
    >
      <v-icon left>mdi-swap-vertical</v-icon>Change level
    </v-btn>

    <span v-if="canOwnMultiple" class="pt-2">Currently owned: {{ owned }}</span>

    <v-btn
      outlined
      v-if="canRemove || canOwnMultiple"
      :disabled="!canRemove"
      @click="cardAction('removeRule')"
    >
      <v-icon left>mdi-minus</v-icon>remove
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RuleCardRestrictions } from "@/heimr/validateCardActions";

export default Vue.extend({
  name: "RuleCardBtnBar",
  props: {
    restrictions: Object
  },
  computed: {
    owned(): number {
      return this.restrictions.owned;
    },
    ownsOtherLevel(): number {
      return this.restrictions.ownsOtherLevel;
    },
    canOwnMultiple(): boolean {
      return this.restrictions.canOwnMultiple;
    },
    canAdd(): boolean {
      return (this.restrictions as RuleCardRestrictions).add.length === 0;
    },
    canRemove(): boolean {
      return (this.restrictions as RuleCardRestrictions).remove.length === 0;
    },
    canChangeLevel(): boolean {
      return (
        (this.restrictions as RuleCardRestrictions).levelChange.length === 0
      );
    }
  },
  methods: {
    cardAction(event: string) {
      this.$emit("cardAction", event);
    }
  }
});
</script>
