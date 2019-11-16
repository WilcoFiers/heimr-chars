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
            :card="findSkill(skill.name)"
          />
        </v-expansion-panels>
      </v-col>
      <v-col v-if="conditions.length > 0" cols="6">
        <h2>Conditions</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="condition in conditions"
            :key="condition.name"
            :card="findCondition(condition.name)"
          />
        </v-expansion-panels>
      </v-col>
      <v-col v-if="items.length > 0" cols="6">
        <h2>Items</h2>
        <v-expansion-panels multiple>
          <RuleExpansionPanel
            v-for="item in items"
            :key="item.name"
            :card="findItem(item.name)"
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
import { Rule, Skill, Condition, Item } from "@/types";
import { db } from "@/firebase";
import { domains } from "@/assets/heimr-data.json";

function searchDomainForRule(
  ruleName: string,
  type: "skills" | "conditions" | "items"
): Rule | undefined {
  let out;
  domains.find(domain => {
    // @ts-ignore
    out = domain[type].find(({ name }) => name === ruleName);
    return !!out;
  });
  return out;
}

// @ts-ignore
export default Vue.extend({
  name: "CharacterResources",
  components: { RuleExpansionPanel },
  data() {
    return {
      name: "Henk",
      rules: []
    };
  },
  computed: {
    skills(): Partial<Skill>[] {
      return this.rules.filter(({ type }: Rule) => type === "skill");
    },
    conditions(): Partial<Condition>[] {
      return this.rules.filter(({ type }: Rule) => type === "condition");
    },
    items(): Partial<Item>[] {
      return this.rules.filter(({ type }: Rule) => type === "item");
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
    findSkill: (name: string): Skill =>
      searchDomainForRule(name, "skills") as Skill,
    findCondition: (name: string): Condition =>
      searchDomainForRule(name, "conditions") as Condition,
    findItem: (name: string): Item => searchDomainForRule(name, "items") as Item
  },
  firestore() {
    const { charId } = this.$route.params;
    const rules = db.collection(`characters/${charId}/rules`);
    return { rules };
  }
});
</script>
