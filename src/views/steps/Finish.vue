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
      <v-col cols="8">
        <v-card class="px-5 mb-5">
          <v-row>
            <v-col v-for="(stat, i) in summaryStats" :key="i">
              <v-row dense v-for="(pair, i) in stat" :key="i">
                <v-col cols="8">{{ pair[0] }}</v-col>
                <v-col>{{ pair[1] }}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="itemCardType in itemCardTypes"
        :key="itemCardType.label"
        cols="12"
        lg="6"
      >
        <v-card height="100%" v-if="itemCardType.characterRules.length === 0">
          <v-card-title class="align-baseline">
            <h2 class="title">{{ itemCardType.label }}</h2>
            <v-spacer />
            <span class="subtitle-1">Cost: {{ itemCardType.total }}</span>
          </v-card-title>
          <v-card-text>
            <p class="mb-0">
              {{ character.name }} does not have any
              {{ itemCardType.label.toLowerCase() }}
            </p>
          </v-card-text>
        </v-card>

        <v-card v-else height="100%">
          <v-card-title
            class="align-baseline v-sheet v-sheet--tile elevation-1 border-bottom"
          >
            <h2 class="title">{{ itemCardType.label }}</h2>
            <v-spacer />
            <span class="subtitle-1">Cost: {{ itemCardType.total }}</span>
          </v-card-title>

          <v-card-text v-if="itemCardType.characterRules.length === 0">
            <p>
              {{ character.name }} does not have any
              {{ itemCardType.label.toLowerCase() }}
            </p>
          </v-card-text>

          <v-expansion-panels v-else class="no-top-radius">
            <RuleExpansionPanel
              v-for="(characterRule, index) in itemCardType.characterRules"
              :key="index"
              :characterRule="characterRule"
              :ruleCard="findRuleCard(characterRule)"
            />
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
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
import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";
import { findRuleCard } from "@/heimr-data";
import { sumCharacterCardCosts } from "@/heimr/characterCardProps";

const labelMap = {
  skill: "Skills",
  condition: "Conditions",
  item: "Items",
  consumable: "Consumables"
};

export default Vue.extend({
  name: "CharacterStepFinish",
  components: { RuleExpansionPanel },

  computed: {
    character(): Partial<Character> {
      return (this.$store.state as State).character.charProps || {};
    },

    characterRules(): CharacterRule[] {
      return (this.$store.state as State).character.rules || [];
    },

    summaryStats() {
      const getters = this.$store.getters;
      const raceCard: Partial<RaceCard> = getters.raceCard || {};
      const {
        pointsLeft,
        dormantLeft,
        coppersLeft,
        monthlySavings,
        freeDormant
      } = getters.characterInfo as CharacterInfo;

      const charCardProps = [
        ["Race", raceCard.name],
        ["Hitpoints", raceCard.hitpoints],
        ["Willpower", raceCard.willpower]
      ];
      const ruleCardProps = [
        ["Starting coppers", `${coppersLeft}¢`],
        ["Monthly savings", `${monthlySavings}¢`]
      ];
      if (freeDormant || dormantLeft) {
        ruleCardProps.unshift(["Dormant points left", String(dormantLeft)]);
      }
      return [charCardProps, ruleCardProps];
    },

    itemCardTypes() {
      const ruleCardTypes: { [propName: string]: CharacterRule[] } = {
        skill: [],
        condition: [],
        item: [],
        consumable: []
      };

      this.characterRules.forEach(characterRule => {
        ruleCardTypes[characterRule.type].push(characterRule);
      });

      return Object.entries(ruleCardTypes).map(([type, characterRules]) => {
        return {
          label:
            labelMap[type as "skill" | "condition" | "item" | "consumable"],
          total: sumCharacterCardCosts(type, characterRules),
          characterRules
        };
      });
    }
  },
  methods: { findRuleCard }
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
</style>
