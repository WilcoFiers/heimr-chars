<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <RuleCardTitle :card="card" />
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <RuleCardContent :card="card" />
      <RuleCardActions :card="card" class="mt-5" @add="reFire('add', $event)" />
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
    card: Object
  },
  methods: {
    reFire(name: string, event: any) {
      this.$emit(name, event);
    }
  }
});
</script>
