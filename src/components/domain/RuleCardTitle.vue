<template>
  <div class="d-flex flex-grow-1">
    <h3>
      <span>{{ ruleCard.name }}</span>
      <v-icon small v-if="quantity" color="primary" right
        >mdi-check-bold</v-icon
      >
    </h3>
    <v-spacer />

    <a
      v-if="ruleCard.type === 'race'"
      target="blank"
      :href="'http://heimr.nl/in_character/lore/' + loreName(ruleCard)"
      :title="'Heimr lore for ' + loreName(ruleCard)"
      >lore</a
    >

    <span v-else-if="ruleCard.points">{{ ruleCard.points }} points</span>
    <span v-else-if="ruleCard.marketPrice">{{ ruleCard.marketPrice }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RaceCard } from "@/types";

export default Vue.extend({
  name: "RuleCardTitle",
  props: {
    ruleCard: Object,
    quantity: Number,
    multiple: Boolean
  },
  methods: {
    loreName({ name }: RaceCard) {
      return name.split(" ")[0].toLowerCase();
    }
  }
});
</script>
