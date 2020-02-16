<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline text-center my-2">
          Welcome to Heimr,
          <strong>{{ character.name }}</strong>
        </h1>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" sm="8">
        <CharacterStats :raceCard="raceCard" :characterInfo="characterInfo" />
      </v-col>

      <v-col cols="12" sm="8" class="mb-5 text-center">
        <v-btn
          class="primary"
          @click="completeDialog = true"
          v-if="!character.isComplete"
          >Complete Character</v-btn
        >
      </v-col>

      <v-col cols="12" sm="8">
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

    <v-dialog v-model="completeDialog" persistent max-width="400">
      <v-card>
        <v-card-title>Finalise {{ character.name }}?</v-card-title>
        <v-card-text>
          Once finalized you can take downtime actions. You will not be able to
          exchange skills or items for free in downtime. Are you sure you want
          to continue?
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="completeDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="completeChar">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Character,
  CharacterRule,
  State,
  RuleCard,
  RaceCard,
  CharacterInfo
} from "@/types";
import CharacterStats from "@/components/character/CharacterStats.vue";
import CharacterNotes from "@/components/character/CharacterNotes.vue";
import CharacterRuleCards from "@/components/character/CharacterRuleCards.vue";

const labelMap = {
  skill: "Skills",
  condition: "Conditions",
  item: "Items",
  consumable: "Consumables"
};

export default Vue.extend({
  name: "CharacterStepFinish",
  components: { CharacterStats, CharacterNotes, CharacterRuleCards },
  data() {
    return { completeDialog: false as Boolean };
  },

  computed: {
    character(): Partial<Character> {
      return (this.$store.state as State).character.charProps || {};
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
    },
    completeChar() {
      this.$store.dispatch("updateCharacter", {
        isComplete: true,
        coppers: this.characterInfo.coppers
      });

      this.completeDialog = false;
      this.$router.push({ name: "character-overview" });
    }
  }
});
</script>

<style scoped>
.border-bottom {
  border-bottom: solid 1px #e0e0e0;
}
.no-top-radius {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

@media (max-width: 600px) {
  /* xs */
  .mobile-right {
    text-align: right;
  }
}
</style>
