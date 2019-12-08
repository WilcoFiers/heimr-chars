<template>
  <ResourceSummary blockTitle="Downtime" :statBlocks="downtimeStats">
    <slot />
  </ResourceSummary>
</template>

<script lang="ts">
import Vue from "vue";
import ResourceSummary from "./ResourceSummary.vue";
import { Character, CharacterRule } from "@/types";
import { character } from "@/store/character";
import {
  getPointsSpent,
  getStartingPoints,
  getCashSpent,
  getStartingCash
} from "@/heimr/computedProps";

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
    downtimeStats(): object {
      // const charRules = this.characterRules as CharacterRule[];
      // const char = (this.character || {}) as Character;
      // const cash: numTuple = [getCashSpent(charRules), getStartingCash(char)];
      // const points: numTuple = [
      //   getPointsSpent(charRules),
      //   getStartingPoints(char)
      // ];

      return [
        {
          title: "Monthly budget",
          value: `120ℜ / 480¢`
        },
        {
          title: "Cost of living",
          value: `400¢`
        },
        {
          title: "Skill upkeep",
          value: `20ℜ`
        },
        {
          title: "Unspent",
          value: `20ℜ / 100¢`
        }
      ];
    }
  }
});
</script>
