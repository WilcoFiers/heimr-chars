<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ character.name }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <CharacterStats
          :raceCard="raceCard"
          :characterInfo="characterInfo"
          class="mb-6"
        />

        <CharacterNotes
          :shortBio="character.shortBio"
          :fullBio="character.fullBio"
          @save="updateField($event.fieldName, $event.value)"
        />
      </v-col>

      <v-col cols="12" md="4">
        <CharacterHistory
          :downtimePeriods="downtimePeriods"
          :createdAt="createdAt"
        >
          <v-btn
            text
            @click="newDowntimePeriod"
            :disabled="hasIncompleteDowntime"
          >
            <v-icon left>mdi-calendar-plus</v-icon>New Downtime Period
          </v-btn>
        </CharacterHistory>
      </v-col>
    </v-row>

    <CharacterRuleCards
      class="mt-6"
      :characterRules="characterRules"
      :characterName="character.name"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  State,
  Character,
  RaceCard,
  CharacterInfo,
  CharacterRule,
  NewDowntimePeriod
} from "@/types";

import CharacterStats from "@/components/character/CharacterStats.vue";
import CharacterNotes from "@/components/character/CharacterNotes.vue";
import CharacterHistory from "@/components/character/CharacterHistory.vue";
import CharacterRuleCards from "@/components/character/CharacterRuleCards.vue";

export default Vue.extend({
  name: "CharacterOverview",
  components: {
    CharacterStats,
    CharacterNotes,
    CharacterHistory,
    CharacterRuleCards
  },
  computed: {
    charProps(): Character | undefined {
      return (this.$store.state as State).character.charProps;
    },

    character(): Character | {} {
      return this.charProps || {};
    },

    createdAt(): number {
      if (this.charProps) {
        return this.charProps.createdAt.toDate().getTime();
      }
      return Date.now();
    },

    characterRules(): CharacterRule[] {
      return (this.$store.state as State).character.rules || [];
    },

    raceCard(): Partial<RaceCard> {
      return this.$store.getters.raceCard || {};
    },

    characterInfo(): CharacterInfo {
      return this.$store.getters.characterInfo;
    },

    downtimePeriods(): NewDowntimePeriod[] {
      return (this.$store.state as State).character.downtimePeriods || [];
    },

    hasIncompleteDowntime(): boolean {
      if (this.downtimePeriods.length === 0) {
        return false;
      }
      return this.downtimePeriods.some(({ complete }) => !complete);
    }
  },

  methods: {
    updateField(fieldName: "shortBio" | "fullBio", value: any) {
      this.$store.dispatch("updateCharacter", { [fieldName]: value });
    },

    async newDowntimePeriod() {
      const downtimeId: number = await this.$store.dispatch(
        "newDowntimePeriod"
      );
      this.$router.push({
        name: "downtime-period",
        params: { downtimeId: `${downtimeId}` }
      });
    }
  },

  watch: {
    charProps: {
      immediate: true,
      handler(charProps) {
        if (charProps && !charProps.isComplete) {
          console.error(
            "Character creation not yet completed. Redirecting user to create"
          );
          this.$router.replace(
            `/characters/${this.$route.params.charId}/create/`
          );
        }
      }
    }
  }
});
</script>
