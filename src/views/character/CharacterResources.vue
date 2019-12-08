<template>
  <v-container>
    <v-row>
      <h1>{{ characterName }}'s Details</h1>
      <v-spacer />
      <v-btn :to="domains()">Domains</v-btn>
    </v-row>

    <v-row>
      <v-col cols="4">
        <CreationSummary
          :character="character"
          :characterRules="characterRules"
        />
      </v-col>
      <v-col cols="4">
        <CharacterSummary
          :character="character"
          :characterRules="characterRules"
        />
      </v-col>
      <v-col cols="4">
        <DowntimeSummary
          :character="character"
          :characterRules="characterRules"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="skills.length > 0" cols="6">
        <h2>Skills</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(skill, index) in skills"
            removable
            :key="index"
            :characterRule="skill"
            :ruleCard="findRuleCard(skill)"
            @remove="removeRule(skill)"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="conditions.length > 0" cols="6">
        <h2>Conditions</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(condition, index) in conditions"
            removable
            :key="index"
            :characterRule="condition"
            :ruleCard="findRuleCard(condition)"
            @remove="removeRule(condition)"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="items.length > 0" cols="6">
        <h2>Items</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(item, index) in items"
            removable
            :key="index"
            :characterRule="item"
            :ruleCard="findRuleCard(item)"
            @remove="removeRule(item)"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="consumables.length > 0" cols="6">
        <h2>Consumable</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(consumable, index) in consumables"
            removable
            :key="index"
            :characterRule="consumable"
            :ruleCard="findRuleCard(consumable)"
            @remove="removeRule(consumable)"
          />
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";
import CreationSummary from "@/components/summary/CreationSummary.vue";
import CharacterSummary from "@/components/summary/CharacterSummary.vue";
import DowntimeSummary from "@/components/summary/DowntimeSummary.vue";
import { CharacterRule, Character } from "@/types";
import { getCharacterRulesCol } from "@/firebase";
import { domains, findRuleCard } from "@/heimr-data";
import { State } from "@/store";

export default Vue.extend({
  name: "CharacterResources",
  components: {
    RuleExpansionPanel,
    CreationSummary,
    CharacterSummary,
    DowntimeSummary
  },

  computed: {
    characterName() {
      const { name = "" } =
        (this.$store.state as State).character.charProps || {};
      return name;
    },
    character(): Character | undefined {
      return (this.$store.state as State).character.charProps;
    },
    characterRules(): CharacterRule[] {
      const { rules } = (this.$store.state as State).character;
      return rules || [];
    },
    skills(): CharacterRule[] {
      return this.characterRules.filter(
        ({ type }: CharacterRule) => type === "skill"
      );
    },
    conditions(): CharacterRule[] {
      return this.characterRules.filter(
        ({ type }: CharacterRule) => type === "condition"
      );
    },
    items(): CharacterRule[] {
      return this.characterRules.filter(
        ({ type }: CharacterRule) => type === "item"
      );
    },
    consumables(): CharacterRule[] {
      return this.characterRules.filter(
        ({ type }: CharacterRule) => type === "consumable"
      );
    }
  },

  methods: {
    findRuleCard,
    back() {
      const { charId } = this.$route.params;
      this.$router.push(`/characters/${charId}`);
    },
    // This can probably be done much better
    domains() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/domains`;
    },

    removeRule(charRule: CharacterRule) {
      this.$store.dispatch("removeCharacterRule", charRule.id);
    }
  }
});
</script>
