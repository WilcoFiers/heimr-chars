<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ character.name }}</h1>
      </v-col>

      <v-col cols="12">
        <CharacterStats :raceCard="raceCard" :characterInfo="characterInfo" />
      </v-col>

      <v-col cols="12">
        <CharacterNotes
          :shortBio="character.shortBio"
          :fullBio="character.fullBio"
          @save="updateField($event.fieldName, $event.value)"
        />
      </v-col>
    </v-row>

    <CharacterRuleCards
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
  CharacterRule
} from "@/types";

import CharacterStats from "@/components/character/CharacterStats.vue";
import CharacterNotes from "@/components/character/CharacterNotes.vue";
import CharacterRuleCards from "@/components/character/CharacterRuleCards.vue";

export default Vue.extend({
  name: "CharacterOverview",
  components: { CharacterStats, CharacterNotes, CharacterRuleCards },
  computed: {
    charProps(): Character | undefined {
      return (this.$store.state as State).character.charProps;
    },

    character(): Character | {} {
      return this.charProps || {};
    },

    characterRules(): CharacterRule[] {
      return (this.$store.state as State).character.rules || [];
    },

    raceCard(): Partial<RaceCard> {
      return this.$store.getters.raceCard || {};
    },

    characterInfo(): CharacterInfo {
      return this.$store.getters.characterInfo;
    }
  },

  methods: {
    updateField(fieldName: "shortBio" | "fullBio", value: any) {
      this.$store.dispatch("updateCharacter", { [fieldName]: value });
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
