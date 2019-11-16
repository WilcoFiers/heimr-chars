<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ domainName }}</h1>
      </v-col>
    </v-row>

    <v-container>
      <v-row>
        <v-col v-if="skills.length > 0" cols="6">
          <h2>Skills</h2>
          <v-expansion-panels multiple>
            <RuleExpansionPanel
              v-for="skill in skills"
              :key="skill.name"
              :card="skill"
              @add="addSkill(skill)"
            />
          </v-expansion-panels>
        </v-col>
        <v-col v-if="conditions.length > 0" cols="6">
          <h2>Conditions</h2>
          <v-expansion-panels multiple>
            <RuleExpansionPanel
              v-for="condition in conditions"
              :key="condition.name"
              :card="condition"
              @add="addCondition(condition)"
            />
          </v-expansion-panels>
        </v-col>
        <v-col v-if="items.length > 0" cols="6">
          <h2>Items</h2>
          <v-expansion-panels multiple>
            <RuleExpansionPanel
              v-for="item in items"
              :key="item.name"
              :card="item"
              @add="addItem(item)"
            />
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>

    <v-row class="px-5">
      <v-btn :to="back()"> <v-icon>mdi-arrow-left</v-icon>Domains </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { domains } from "@/assets/heimr-data.json";
import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";
import { Domain, Skill, Condition, Item } from "@/types";

export default Vue.extend({
  name: "DomainOverview",
  components: { RuleExpansionPanel },
  data() {
    const domain = domains.find(({ domainName }) => {
      const match = domainName.toLowerCase().replace(/\s+/g, "_");
      return match === this.$route.params.domain;
    }) as Domain;

    return {
      ...domain
    };
  },
  methods: {
    back() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/domains`;
    },
    addSkill(rule: Skill) {
      const { charId } = this.$route.params;
      this.$store.dispatch("addCharacterRule", { charId, rule });
    },
    addCondition(condition: Condition) {
      console.log("add condition", condition);
    },
    addItem(item: Item) {
      console.log("add item", item);
    }
  }
});
</script>
