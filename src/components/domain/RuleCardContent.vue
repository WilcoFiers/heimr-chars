<template>
  <div>
    <p v-if="ruleCard.type === 'race'">
      <strong>Hitpoints:</strong>
      {{ ruleCard.hitpoints }} /
      <strong>Willpower:</strong>
      {{ ruleCard.willpower }}
    </p>
    <p v-if="ruleCard.details">{{ ruleCard.details }}</p>
    <div v-if="ruleCard.uniqueRules">
      <h4>Unique rules</h4>
      <ul>
        <li v-for="(rule, i) in ruleCard.uniqueRules" :key="i">{{ rule }}</li>
      </ul>
    </div>
    <div v-if="ruleCard.sharedRules" class="mt-2">
      <h4>Shared rules</h4>
      <ul>
        <li v-for="(rule, i) in ruleCard.sharedRules" :key="i">{{ rule }}</li>
      </ul>
    </div>
    <div v-if="ruleCard.downtimeRules" class="mt-2">
      <h4>Downtime rules</h4>
      <ul>
        <li v-for="(rule, i) in ruleCard.downtimeRules" :key="i">{{ rule }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Race } from "@/types";

export default Vue.extend({
  name: "RuleCardContent",
  props: {
    ruleCard: Object
  },
  methods: {
    loreName({ name }: Race) {
      return name.split(" ")[0].toLowerCase();
    }
  }
});
</script>
