<template>
  <v-btn :to="to" text>
    <span>{{ unspentResources }} points</span>
    <span> / </span>
    <span>{{ unspentMoney }} Money</span>
  </v-btn>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CharacterRule, RuleCard, Skill, Condition, Item } from "@/types";
import { findRuleCard, parseRuleValue } from "@/heimr-data";

export default Vue.extend({
  name: "ResourceMini",
  props: {
    rules: Array as PropType<CharacterRule[]>,
    to: String,
    money: Number,
    resources: Number
  },
  computed: {
    ruleDefinitions(): RuleCard[] {
      return this.rules.map(findRuleCard).filter((rule): rule is RuleCard => {
        return !!rule;
      });
    },
    unspentMoney(): number {
      // TODO: move to a utility
      const items = this.ruleDefinitions.filter((rule): rule is Item => {
        return rule.type === "item";
      });

      const moneySpent = items.reduce((total, rule): number => {
        const marketPrice = parseRuleValue(rule.marketPrice);
        if (marketPrice && marketPrice.unit == "¢") {
          total += marketPrice.value;
        }
        return total;
      }, 0);

      return this.money - moneySpent;
    },

    unspentResources(): number {
      // TODO: move to a utility
      const pointRules = (this.rules as CharacterRule[])
        .map(findRuleCard)
        .filter((rule: RuleCard | null): rule is Skill | Condition => {
          return !!rule && rule.type !== "item";
        });

      const resourceSpent = pointRules.reduce((total: number, rule): number => {
        if (typeof rule.points === "number") {
          total += rule.points;
        }
        return total;
      }, 0);

      return this.resources - resourceSpent;
    }
  }
});
</script>
