<template>
  <v-row>
    <v-col
      v-for="itemCardType in ruleCardTypes"
      :key="itemCardType.label"
      cols="12"
      lg="6"
    >
      <v-card height="100%" v-if="itemCardType.characterRules.length === 0">
        <v-card-title class="align-baseline">
          <h2 class="title">{{ itemCardType.label }}</h2>
          <v-spacer />
          <span class="subtitle-1">{{ itemCardType.total }}</span>
        </v-card-title>
        <v-card-text>
          <p class="mb-0">
            {{ characterName }} does not have any
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
          <span class="subtitle-1">{{ itemCardType.total }}</span>
        </v-card-title>

        <v-card-text v-if="itemCardType.characterRules.length === 0">
          <p>
            {{ characterName }} does not have any
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
</template>

<script lang="ts">
import Vue from "vue";
import { CharacterRule } from "@/types";
import { sumCharacterCardCosts } from "@/heimr/characterCardProps";
import { findRuleCard } from "@/heimr-data";

import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";

const labelMap = {
  skill: "Skills",
  condition: "Conditions",
  item: "Items",
  consumable: "Consumables"
};

export default Vue.extend({
  name: "CharacterRuleCards",
  props: {
    characterRules: Array,
    characterName: String
  },
  components: { RuleExpansionPanel },
  methods: { findRuleCard },
  computed: {
    ruleCardTypes() {
      const ruleCardTypes: { [propName: string]: CharacterRule[] } = {
        skill: [],
        condition: [],
        item: [],
        consumable: []
      };

      (this.characterRules as CharacterRule[]).forEach(characterRule => {
        // Only show inactive (dormant) skills
        if (characterRule.inactive && characterRule.type !== "skill") {
          return;
        }
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
  }
});
</script>
