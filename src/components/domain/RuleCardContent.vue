<template>
  <div>
    <p v-if="card.type === 'race'">
      <strong>Hitpoints:</strong>
      {{ card.hitpoints }} /
      <strong>Willpower:</strong>
      {{ card.willpower }}
    </p>
    <p v-if="card.details">{{ card.details }}</p>
    <div v-if="card.uniqueRules">
      <h4>Unique rules</h4>
      <ul>
        <li v-for="(rule, i) in card.uniqueRules" :key="i">{{ rule }}</li>
      </ul>
    </div>
    <div v-if="card.sharedRules" class="mt-2">
      <h4>Shared rules</h4>
      <ul>
        <li v-for="(rule, i) in card.sharedRules" :key="i">{{ rule }}</li>
      </ul>
    </div>
    <div v-if="card.downtimeRules" class="mt-2">
      <h4>Downtime rules</h4>
      <ul>
        <li v-for="(rule, i) in card.downtimeRules" :key="i">{{ rule }}</li>
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
    card: Object
  },
  methods: {
    loreName({ name }: Race) {
      return name.split(" ")[0].toLowerCase();
    }
  }
});
</script>
