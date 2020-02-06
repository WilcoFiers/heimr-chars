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
      <v-col sm="8">
        <v-card class="px-5">
          <v-row>
            <v-col v-for="(stat, i) in summaryStats" :key="i">
              <v-row dense v-for="(pair, i) in stat" :key="i">
                <v-col>{{ pair[0] }}</v-col>
                <v-col class="mobile-right">{{ pair[1] }}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col sm="8">
        <v-card>
          <v-card-text>
            <v-text-field
              label="Short bio (public)"
              :value="character.shortBio"
              @blur="updateField('shortBio', $event.target.value)"
            />
            <v-textarea
              label="Full bio (hidden)"
              :value="character.fullBio"
              @blur="updateField('fullBio', $event.target.value)"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="8" class="mb-5 text-center">
        <v-btn
          class="primary"
          @click="completeDialog = true"
          v-if="!character.isComplete"
          >Complete Character</v-btn
        >
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
  methods: {
    findRuleCard,
    updateField(fieldName: string, value: any) {
      this.$store.dispatch("updateCharacter", { [fieldName]: value });
    },
    completeChar() {
      this.$store.dispatch("updateCharacter", { isComplete: true });
      this.completeDialog = false;
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
