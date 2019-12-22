<template>
  <v-sheet elevation="1">
    <v-container class="d-block d-sm-flex d-xl-block">
      <v-row
        v-for="(stat, i) in visibleStatBlocks"
        :key="i"
        dense
        :class="{ 'error--text': stat.error }"
      >
        <v-col cols="6" sm="12" xl="6">
          <strong>{{ stat.title }}</strong>
          <v-tooltip v-if="stat.error" top>
            <template v-slot:activator="{ on }">
              <v-icon color="error" v-on="on" small tabindex="0"
                >mdi-alert-rhombus-outline</v-icon
              >
            </template>
            <span>Spent more than allowed</span>
          </v-tooltip>
        </v-col>
        <v-col cols="6" sm="12" xl="6">{{ stat.value }}</v-col>
      </v-row>
    </v-container>
    <slot />
  </v-sheet>
</template>

<script lang="ts">
import Vue from "vue";
import { Character, CharacterRule } from "@/types";
import { character } from "@/store/character";
import { getStartingPoints, getStartingCash } from "@/heimr/characterProps";
import { getPointsSpent, getCashSpent } from "@/heimr/characterCardProps";

export type Stat = {
  title: string;
  value: string;
  error?: boolean;
  hidden?: boolean;
};

export default Vue.extend({
  name: "ResourceSummary",
  props: {
    blockTitle: String,
    statBlocks: Array
  },
  computed: {
    visibleStatBlocks() {
      return (this.statBlocks as Stat[]).filter(({ hidden }) => !hidden);
    }
  }
});
</script>
