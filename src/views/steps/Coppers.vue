<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between pb-1">
          <h1 class="headline">Coppers</h1>
          <CreationGuideBtn />
        </div>
        <p>
          Spend 500 copper on items and consumables, plus 100 points for each
          unspent character point. Unspent coppers are part of your starting
          capital.
        </p>
      </v-col>
    </v-row>
    <BaseCharacterCard :domains="domains" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Domain, State } from "@/types";
import BaseCharacterCard, { activeDomains } from "./BaseCharacterCard.vue";
import CreationGuideBtn from "@/components/character/CreationGuideBtn.vue";

export default Vue.extend({
  name: "CharacterStepCoppers",
  components: { BaseCharacterCard, CreationGuideBtn },

  computed: {
    domains(): Domain[] {
      return activeDomains((this.$store.state as State).character).map(
        domain => {
          // Show the domain without skills and conditions
          return { ...domain, skills: [], conditions: [] };
        }
      );
    }
  }
});
</script>
