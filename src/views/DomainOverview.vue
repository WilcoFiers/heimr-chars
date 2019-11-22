<template>
  <v-container>
    <v-row class="mx-1">
      <h1>{{ domain.domainName }}</h1>
      <v-spacer />
      <ResourceMini
        :rules="rules"
        :money="500"
        :resources="20"
        :to="resources()"
      />
    </v-row>

    <v-row>
      <v-col v-if="domain.skills.length > 0" cols="6">
        <h2>Skills</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(skillCard, index) in domain.skills"
            :key="index"
            :ruleCard="skillCard"
            :quantity="quantity(skillCard)"
            @add="addRule(skillCard)"
            @remove="removeRule(skillCard)"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="domain.conditions.length > 0" cols="6">
        <h2>Conditions</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(conditionCard, index) in domain.conditions"
            :key="index"
            :ruleCard="conditionCard"
            :quantity="quantity(conditionCard)"
            @add="addRule(conditionCard)"
            @remove="removeRule(conditionCard)"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="domain.items.length > 0" cols="6">
        <h2>Items</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(itemCard, index) in domain.items"
            :key="index"
            :ruleCard="itemCard"
            :quantity="quantity(itemCard)"
            @add="addRule(itemCard)"
            @remove="removeRule(itemCard)"
            :multiple="true"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="domain.consumables.length > 0" cols="6">
        <h2>Consumables</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="(consumableCard, index) in domain.consumables"
            :key="index"
            :ruleCard="consumableCard"
            :quantity="quantity(consumableCard)"
            @add="addRule(consumableCard)"
            @remove="removeRule(consumableCard)"
            :multiple="true"
          />
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row class="px-5">
      <v-btn :to="back()"> <v-icon>mdi-arrow-left</v-icon>Domains </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { domains } from "@/heimr-data";
import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";
import ResourceMini from "@/components/character/ResourceMini.vue";
import { getCharacterRulesCol } from "@/firebase";
import { Domain, RuleCard, State, CharacterRule } from "@/types";

export default Vue.extend({
  name: "DomainOverview",
  components: { RuleExpansionPanel, ResourceMini },
  data(): { domain: Domain } {
    const domain = domains.find(({ domainName }) => {
      const match = domainName.toLowerCase().replace(/\s+/g, "_");
      return match === this.$route.params.domain;
    }) as Domain;

    console.log(domain);

    return { domain };
  },

  computed: {
    rules(): CharacterRule[] {
      const { rules } = (this.$store.state as State).character;
      return rules || [];
    }
  },

  methods: {
    resources() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/resources`;
    },

    back() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/domains`;
    },

    findCharacterRules(ruleCard: RuleCard): CharacterRule[] {
      return this.rules.filter(
        characterRule =>
          characterRule.type === ruleCard.type &&
          characterRule.domainName === this.domain.domainName &&
          characterRule.name === ruleCard.name
      );
    },

    quantity(ruleCard: RuleCard): number {
      return this.findCharacterRules(ruleCard).length;
    },

    addRule(rule: RuleCard) {
      const domainName = this.domain.domainName;
      const { type, name } = rule;
      const characterCard = { type, name, domainName };
      this.$store.dispatch("addCharacterRule", characterCard);
    },

    removeRule(ruleCard: RuleCard) {
      const charRules = this.findCharacterRules(ruleCard);
      if (charRules.length) {
        this.$store.dispatch("removeCharacterRule", charRules[0].id);
      }
    }
  }
});
</script>
