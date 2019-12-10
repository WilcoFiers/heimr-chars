<template>
  <ResourceSummary blockTitle="Character Creation" :statBlocks="creationStats">
    <slot />
  </ResourceSummary>
</template>

<script lang="ts">
import Vue from "vue";
import ResourceSummary from "./ResourceSummary.vue";
import { Character, CharacterRule } from "@/types";
import { character } from "@/store/character";
import { getStartingPoints, getStartingCash } from "@/heimr/characterProps";
import {
  getPointsSpent,
  getCashSpent,
  getMonthlySavings
} from "@/heimr/characterCardProps";
type numTuple = [number, number];

function tupleToString(val: numTuple, unit: string = ""): string {
  return `${val[0]}${unit} / ${val[1]}${unit}`;
}

export default Vue.extend({
  name: "CreationSummary",
  components: { ResourceSummary },
  props: {
    character: {
      type: Object
    },
    characterRules: {
      type: Array
    }
  },

  computed: {
    creationStats(): object {
      const charRules = this.characterRules as CharacterRule[];
      const char = (this.character || {}) as Character;
      const cash: numTuple = [getCashSpent(charRules), getStartingCash(char)];
      const points: numTuple = [
        getPointsSpent(charRules),
        getStartingPoints(char)
      ];
      const monthlySavings = getMonthlySavings(char, charRules);

      return [
        {
          title: "Starting points",
          value: tupleToString(points),
          error: points[0] > points[1]
        },
        {
          title: "Cash",
          value: tupleToString(cash, "¢"),
          error: cash[0] > cash[1]
        },
        {
          title: "Monthly savings",
          value: monthlySavings + "¢"
        }
      ];
    }
  }
});
</script>
