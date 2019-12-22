<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Character Points</h1>
        <div>
          Spend between 15 and 20 points on skills and conditions. Unspent
          points give you 100 copper each.
        </div>
      </v-col>
    </v-row>

    <BaseCharacterCard :domains="domains" />
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
import { getPointsSpent } from "@/heimr/characterCardProps";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default Vue.extend({
  name: "CharacterStepPoints",
  components: { BaseCharacterCard, ErrorMessage },
  data() {
    const value = 10;
    return { value: value * 5, message: "" };
  },

  computed: {
    domains(): Domain[] {
      return activeDomains((this.$store.state as State).character).map(
        domain => {
          // Show the domain without items and consumables
          return { ...domain, items: [], consumables: [] };
        }
      );
    }
  },
  methods: {
    save() {
      const pointsSpent = this.$store.getters.characterRuleStates
        .pointsSpent as number;
      if (pointsSpent < 15) {
        this.message = `You must spend at least 15 points, you spent ${pointsSpent} points so far.`;
        return false; // prevents throwing an error
      }
    }
  }
});
</script>
