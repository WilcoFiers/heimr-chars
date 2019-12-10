<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ blockTitle }}</h2>
      </v-col>
    </v-row>

    <v-row
      v-for="(stat, i) in statBlocks"
      :key="i"
      dense
      :class="{ 'error--text': stat.error }"
    >
      <v-col cols="7">
        {{ stat.title }}
        <v-tooltip v-if="stat.error" top>
          <template v-slot:activator="{ on }">
            <v-icon color="error" v-on="on" small tabindex="0"
              >mdi-alert-rhombus-outline</v-icon
            >
          </template>
          <span>Spent more than allowed</span>
        </v-tooltip>
      </v-col>
      <v-col>{{ stat.value }}</v-col>
    </v-row>

    <slot />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Character, CharacterRule } from "@/types";
import { character } from "@/store/character";
import { getStartingPoints, getStartingCash } from "@/heimr/characterProps";
import { getPointsSpent, getCashSpent } from "@/heimr/characterCardProps";

export default Vue.extend({
  name: "ResourceSummary",
  props: {
    blockTitle: String,
    statBlocks: Array
  }
});
</script>
