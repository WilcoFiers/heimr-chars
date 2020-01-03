<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between pb-1">
          <h1 class="headline">Coppers</h1>
          <CreationGuideBtn />
        </div>
        <p class="ma-0">
          Spend 500 copper on items and consumables, plus 100 copper for each
          unspent character point. Unspent coppers are part of your starting
          capital.
        </p>
      </v-col>
    </v-row>
    <v-row class="justify-center flex-row-reverse">
      <v-col cols="10" sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-card-text class="text-center">
            <div class="font-weight-bold">{{ coppersProgress.label }}</div>
            <v-progress-linear
              :value="coppersProgress.value"
              :color="coppersProgress.color"
              rounded
              height="6"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" xl="9">
        <BaseCharacterCard :domains="domains" />
      </v-col>
    </v-row>

    <v-row v-if="message">
      <v-col>
        <ErrorMessage :message="message" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Domain, State } from "@/types";
import BaseCharacterCard, { activeDomains } from "./BaseCharacterCard.vue";
import CreationGuideBtn from "@/components/character/CreationGuideBtn.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import { ProgressBarVal } from "./points.vue";

export default Vue.extend({
  name: "CharacterStepCoppers",
  components: { BaseCharacterCard, CreationGuideBtn, ErrorMessage },
  data() {
    return { message: "" };
  },

  computed: {
    domains(): Domain[] {
      return activeDomains((this.$store.state as State).character).map(
        domain => {
          // Show the domain without skills and conditions
          return { ...domain, skills: [], conditions: [] };
        }
      );
    },

    coppersProgress(): ProgressBarVal {
      const {
        coppersSpent,
        unspentCoppers
      } = this.$store.getters.characterRuleStates;
      const totalCoppers = coppersSpent + unspentCoppers;
      let color = "accent";
      if (unspentCoppers < 0) {
        color = "error lighten-4";
      }
      return {
        label: `${coppersSpent} / ${totalCoppers} coppers spent`,
        value: Math.floor(Math.min((100 / totalCoppers) * coppersSpent, 100)),
        color
      };
    }
  },

  methods: {
    save() {
      const unspentCoppers = this.$store.getters.characterRuleStates
        .unspentCoppers as number;
      if (unspentCoppers < 0) {
        this.message = `You have spent ${-unspentCoppers} coppers too much`;
      }
      return this.message === "";
    }
  }
});
</script>
