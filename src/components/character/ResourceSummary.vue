<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Character Creation</h2>
      </v-col>
    </v-row>

    <v-row
      v-for="(charDetail, i) in charCreation"
      :key="i"
      dense
      :class="{ 'error--text': charDetail.error }"
    >
      <v-col cols="7">
        {{ charDetail.name }}
        <v-tooltip v-if="charDetail.error" top>
          <template v-slot:activator="{ on }">
            <v-icon color="error" v-on="on" small tabindex="0"
              >mdi-alert-rhombus-outline</v-icon
            >
          </template>
          <span>Spent more than allowed</span>
        </v-tooltip>
      </v-col>
      <v-col>{{ charDetail.value }}</v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn :to="resourceUrl">Details</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
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
  name: "ResourceSummary",
  props: {
    character: {
      type: Object
    },
    characterRules: {
      type: Array
    }
  },
  computed: {
    charCreation(): object {
      const charRules = this.characterRules as CharacterRule[];
      const char = this.character as Character;
      const cash: numTuple = [getCashSpent(charRules), getStartingCash(char)];
      const points: numTuple = [
        getPointsSpent(charRules),
        getStartingPoints(char)
      ];

      return [
        {
          name: "Starting points",
          value: tupleToString(points),
          error: points[0] > points[1]
        },
        {
          name: "Cash",
          value: tupleToString(cash, "¢"),
          error: cash[0] > cash[1]
        }
      ];
    },

    resourceUrl(): string {
      const { charId } = this.$route.params;
      return `/characters/${charId}/resources`;
    }
  }
});
</script>
