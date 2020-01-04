<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between pb-1">
          <h1 class="headline">Character Points</h1>
          <CreationGuideBtn />
        </div>
        <p class="ma-0">
          Spend between 15 and 20 points on skills and conditions. Unspent
          points give you 100 copper each.
        </p>
      </v-col>
    </v-row>
    <v-row class="justify-center flex-row-reverse">
      <v-col cols="10" sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="font-weight-bold">{{ pointsProgress.label }}</div>
            <v-progress-linear
              :value="pointsProgress.value"
              :color="pointsProgress.color"
              rounded
              height="6"
            />
            <template v-if="dormantProgress">
              <div class="pt-2 font-weight-bold">
                {{ dormantProgress.label }}
              </div>
              <v-progress-linear
                :value="dormantProgress.value"
                :color="dormantProgress.color"
                rounded
                height="6"
              />
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="9">
        <BaseCharacterCard :domains="domains" @action="messages = []" />
      </v-col>
    </v-row>

    <v-row v-if="messages">
      <v-col>
        <ErrorMessage :message="messages" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Domain, State, CharacterInfo } from "@/types";
import BaseCharacterCard, { activeDomains } from "./BaseCharacterCard.vue";
import { getPointsSpent } from "@/heimr/characterCardProps";
import CreationGuideBtn from "@/components/character/CreationGuideBtn.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import { validatePoints } from "@/heimr/validateSteps";

export type ProgressBarVal = {
  label: string;
  value: number;
  color: string;
};

export default Vue.extend({
  name: "CharacterStepPoints",
  components: { BaseCharacterCard, CreationGuideBtn, ErrorMessage },
  data() {
    return { messages: [] as String[] };
  },

  computed: {
    domains(): Domain[] {
      return activeDomains((this.$store.state as State).character).map(
        domain => {
          // Show the domain without items and consumables
          return { ...domain, items: [], consumables: [] };
        }
      );
    },

    pointsProgress(): ProgressBarVal {
      const {
        pointsSpent,
        startingPoints,
        pointConvertionMax
      } = this.$store.getters.characterInfo;
      let color = "accent";
      if (pointsSpent < startingPoints - pointConvertionMax) {
        color = "warning lighten-2";
      } else if (pointsSpent > startingPoints) {
        color = "error lighten-4";
      }
      return {
        label: `${pointsSpent} / ${startingPoints} character points`,
        value: Math.floor(Math.min((100 / startingPoints) * pointsSpent, 100)),
        color
      };
    },

    dormantProgress(): ProgressBarVal | undefined {
      const { dormantSpent, freeDormant } = this.$store.getters.characterInfo;
      if (!freeDormant) {
        return undefined;
      }
      let color = "accent";
      if (dormantSpent > freeDormant) {
        color = "error lighten-4";
      }
      return {
        label: `${dormantSpent} / ${freeDormant} dormant points`,
        value: Math.min((100 / freeDormant) * dormantSpent, 100),
        color
      };
    }
  },

  methods: {
    save(): boolean {
      this.messages = validatePoints(
        this.$store.getters.characterInfo as CharacterInfo
      );
      return this.messages.length === 0;
    }
  }
});
</script>
