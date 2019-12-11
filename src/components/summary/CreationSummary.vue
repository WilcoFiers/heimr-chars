<template>
  <ResourceSummary blockTitle="Character Creation" :statBlocks="creationStats">
    <slot />
  </ResourceSummary>
</template>

<script lang="ts">
import Vue from "vue";
import ResourceSummary, { Stat } from "./ResourceSummary.vue";
import { Character, CharacterRule } from "@/types";
import { character } from "@/store/character";
import { getCharacterProps } from "@/heimr/characterProps";
import {
  getPointsSpent,
  getCashSpent,
  getMonthlySavings
} from "@/heimr/characterCardProps";

type NumTuple = [number, number];

function tupleToString(val: NumTuple, unit: string = ""): string {
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
    creationStats(): Stat[] {
      const charRules = this.characterRules as CharacterRule[];
      const char = (this.character || {}) as Character;

      const { startingPoints, startingCash, freeDormant } = getCharacterProps(
        char
      );

      const cash: NumTuple = [getCashSpent(charRules), startingCash];
      const points: NumTuple = [getPointsSpent(charRules), startingPoints];
      const dormant: NumTuple = [getPointsSpent(charRules, true), freeDormant];
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
          title: "Dormant skills",
          value: tupleToString(dormant),
          error: dormant[0] > dormant[1],
          hidden: !dormant[0] && !dormant[1]
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
