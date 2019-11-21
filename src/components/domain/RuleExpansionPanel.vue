<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <RuleCardTitle v-bind="$props" />
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <RuleCardContent v-bind="$props" />
      <RuleCardActions
        v-bind="$props"
        class="mt-5"
        @add="reFire('add', $event)"
        @remove="reFire('remove', $event)"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import RuleCardTitle from "./RuleCardTitle.vue";
import RuleCardContent from "./RuleCardContent.vue";
import RuleCardActions from "./RuleCardActions.vue";

export default Vue.extend({
  name: "RuleExpansionPanel",
  components: {
    RuleCardTitle,
    RuleCardContent,
    RuleCardActions
  },
  props: {
    ruleCard: Object,
    quantity: Number,
    multiple: Boolean,
    removable: Boolean
  },
  methods: {
    reFire(name: string, event: any) {
      this.$emit(name, event);
    }
  }
});
</script>
