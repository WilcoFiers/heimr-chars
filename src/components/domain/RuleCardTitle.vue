<template>
  <div class="d-flex flex-grow-1">
    <h3>{{ card.name }}</h3>
    <v-spacer />

    <a
      v-if="card.type === 'race'"
      target="blank"
      :href="'http://heimr.nl/in_character/lore/' + loreName(card)"
      :title="'Heimr lore for ' + loreName(card)"
      >lore</a
    >

    <span v-else-if="card.points">{{ card.points }} points</span>
    <span v-else-if="card.marketPrice">{{ card.marketPrice }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Race } from "@/types";

export default Vue.extend({
  name: "RuleCardTitle",
  props: {
    card: Object,
    noHeading: Boolean,
    flat: Boolean
  },
  methods: {
    loreName({ name }: Race) {
      return name.split(" ")[0].toLowerCase();
    }
  }
});
</script>
