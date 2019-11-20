<template>
  <v-container>
    <v-row>
      <h1>{{ name }}'s Skills &amp; Conditions</h1>
      <v-spacer />
      <v-btn :to="domains()">Domains</v-btn>
    </v-row>

    <v-row>
      <v-col v-if="skills.length > 0" cols="6">
        <h2>Skills</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="skill in skills"
            :key="skill.name"
            :card="findRule(skill)"
          />
        </v-expansion-panels>
      </v-col>
      <v-col v-if="conditions.length > 0" cols="6">
        <h2>Conditions</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="condition in conditions"
            :key="condition.name"
            :card="findRule(condition)"
          />
        </v-expansion-panels>
      </v-col>
      <v-col v-if="items.length > 0" cols="6">
        <h2>Items</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="item in items"
            :key="item.name"
            :card="findRule(item)"
          />
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="6"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";
import { Rule, Skill, Condition, Item, CharacterRule, Domain } from "@/types";
import { getCharacterRulesCol } from "@/firebase";
import { domains, findRule } from "@/heimr-data";
import { State } from "@/store";

export default Vue.extend({
  name: "CharacterResources",
  components: { RuleExpansionPanel },

  data() {
    const { charProps } = (this.$store.state as State).character;
    return {
      name: charProps ? charProps.name : ""
    };
  },

  computed: {
    rules(): CharacterRule[] {
      const { rules } = (this.$store.state as State).character;
      return rules || [];
    },
    skills(): CharacterRule[] {
      return this.rules.filter(({ type }: CharacterRule) => type === "skill");
    },
    conditions(): CharacterRule[] {
      return this.rules.filter(
        ({ type }: CharacterRule) => type === "condition"
      );
    },
    items(): CharacterRule[] {
      return this.rules.filter(({ type }: CharacterRule) => type === "item");
    }
  },

  methods: {
    back() {
      const { charId } = this.$route.params;
      this.$router.push(`/characters/${charId}`);
    },
    // This can probably be done much better
    domains() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/domains`;
    },

    findRule(charRule: CharacterRule): Rule | null {
      return findRule(charRule);
    }
  }
});
</script>
