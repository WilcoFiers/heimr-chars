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
            v-for="skill in domain.skills"
            :key="skill.name"
            :card="skill"
            @add="addRule(skill)"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="domain.conditions.length > 0" cols="6">
        <h2>Conditions</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="condition in domain.conditions"
            :key="condition.name"
            :card="condition"
            @add="addRule(condition)"
          />
        </v-expansion-panels>
      </v-col>

      <v-col v-if="domain.items.length > 0" cols="6">
        <h2>Items</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="item in domain.items"
            :key="item.name"
            :card="item"
            @add="addRule(item)"
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
import {
  Domain,
  Skill,
  Condition,
  Item,
  Rule,
  Character,
  State
} from "@/types";

export default Vue.extend({
  name: "DomainOverview",
  components: { RuleExpansionPanel, ResourceMini },
  data() {
    const domain = domains.find(({ domainName }) => {
      const match = domainName.toLowerCase().replace(/\s+/g, "_");
      return match === this.$route.params.domain;
    }) as Domain;

    return {
      rules: [],
      domain
    };
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
    addRule(rule: Rule) {
      const { charId } = this.$route.params;
      const domainName = this.domain.domainName;
      const { type, name } = rule;
      this.$store.dispatch("addCharacterRule", {
        charId,
        type,
        name,
        domainName
      });
    }
  },

  firestore() {
    const rules = getCharacterRulesCol(this.$route.params.charId);
    return { rules };
  }
});
</script>
