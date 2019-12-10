<template>
  <ResourceSummary blockTitle="Character Stats" :statBlocks="characterStats">
    <slot />
  </ResourceSummary>
</template>

<script lang="ts">
import Vue from "vue";
import ResourceSummary from "./ResourceSummary.vue";
import { Character, CharacterRule } from "@/types";
import { character } from "@/store/character";
import { getStartingPoints, getStartingCash } from "@/heimr/characterProps";
import { getPointsSpent, getCashSpent } from "@/heimr/characterCardProps";

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
    characterStats(): object {
      const charRules = this.characterRules as CharacterRule[];
      const char = (this.character || {}) as Character;
      const cash: numTuple = [getCashSpent(charRules), getStartingCash(char)];
      const points: numTuple = [
        getPointsSpent(charRules),
        getStartingPoints(char)
      ];

      return [
        {
          title: "Hitpoints",
          value: 1
        },
        {
          title: "Willpower",
          value: 6
        },
        {
          title: "Wealth",
          value: 300 + " ¢"
        }
      ];
    }
  }
});
</script>
