<template>
  <v-card class="px-5">
    <v-row>
      <v-col v-for="(stat, i) in summaryStats" :key="i">
        <v-row dense v-for="(pair, i) in stat" :key="i">
          <v-col>{{ pair[0] }}</v-col>
          <v-col class="mobile-right">{{ pair[1] }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { RaceCard, CharacterInfo } from "@/types";

export default Vue.extend({
  name: "CharacterStats",
  props: {
    raceCard: Object,
    characterInfo: Object
  },

  computed: {
    summaryStats() {
      const raceCard = (this.raceCard || {}) as Partial<RaceCard>;
      const {
        pointsLeft,
        dormantLeft,
        coppers,
        monthlySavings,
        freeDormant
      } = this.characterInfo as CharacterInfo;

      const charCardProps = [
        ["Race", raceCard.name],
        ["Hitpoints", raceCard.hitpoints],
        ["Willpower", raceCard.willpower]
      ];

      const ruleCardProps = [
        ["Coppers", `${coppers}¢`],
        ["Monthly savings", `${monthlySavings}¢`]
      ];

      return [charCardProps, ruleCardProps];
    }
  }
});
</script>
