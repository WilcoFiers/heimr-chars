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
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
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
        <BaseCharacterCard :domains="domains" @action="messages = []" />
      </v-col>
    </v-row>

    <v-row v-if="messages && messages.length > 0">
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
import CreationGuideBtn from "@/components/character/CreationGuideBtn.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import { ProgressBarVal } from "./Points.vue";
import { validateCoppers } from "@/heimr/validateSteps";

export default Vue.extend({
  name: "CharacterStepCoppers",
  components: { BaseCharacterCard, CreationGuideBtn, ErrorMessage },
  data() {
    return { messages: [] as string[] };
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
      const { coppersSpent, coppers } = this.$store.getters.characterInfo;
      const totalCoppers = coppersSpent + coppers;
      let color = "secondary";
      if (coppers < 0) {
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
    save(): boolean {
      this.messages = validateCoppers(
        this.$store.getters.characterInfo as CharacterInfo
      );
      return this.messages.length === 0;
    }
  }
});
</script>
