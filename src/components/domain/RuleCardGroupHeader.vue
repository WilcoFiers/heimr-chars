<template>
  <div class="d-flex">
    <h3>
      {{ ruleCardGroup.groupName }}{{ ruleGroupLevelText }}
      <v-icon small color="primary" v-if="groupIcon">{{ groupIcon }}</v-icon>
    </h3>
    <v-spacer />
    <span class="flex-grow-0 mr-5">{{ ruleGroupCostText }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { parseRuleValue, RuleCardGroup } from "@/heimr-data";

function getItemCardCost(ruleCardGroup: RuleCardGroup) {
  let min: number = 0;
  let max: number = 0;
  let unit: string = "";
  ruleCardGroup.ruleCards.forEach(({ ruleCard }) => {
    let value: number = min;
    const { marketPrice, points } = ruleCard as {
      marketPrice?: string;
      points?: number;
    };
    if (marketPrice && points) {
      throw new Error("Can not have card with both marketPrice and points");
    }
    if (typeof points === "number") {
      value = points;
    } else {
      const parsed = parseRuleValue(marketPrice) || { unit: "", value: 0 };
      unit = parsed.unit || unit;
      value = parsed.value || min;
    }

    min = !min ? value : Math.min(value, min);
    max = Math.max(value, max);
  });
  return { min, max, unit };
}

export default Vue.extend({
  name: "RuleCardGroupHeader",
  props: {
    ruleCardGroup: {
      type: Object,
      required: true
    }
  },
  computed: {
    ruleGroupLevelText(): string {
      const length: number = this.ruleCardGroup.length;
      if (length === 1) {
        return "";
      }
      if (length === 2) {
        return ", level 1 & 2";
      }
      return `, level 1 - ${length}`;
    },

    groupIcon(): string {
      const ruleCards = (this.ruleCardGroup as RuleCardGroup).ruleCards;
      const ownsAny = ruleCards.some(
        ({ restrictions }) => restrictions.owned > 0
      );
      if (!ownsAny) {
        return "";
      } else if (ruleCards.length > 1) {
        return "mdi-star-outline";
      } else {
        return "mdi-star";
      }
    },

    ruleGroupCostText(): string {
      const { min, max, unit } = getItemCardCost(this.ruleCardGroup);
      let tail = "";
      if (!unit) {
        tail = " point" + (max > 1 ? "s" : "");
      }

      if (max === 0) {
        return "";
      }
      if (min === max) {
        return `${max}${unit}${tail}`;
      }

      return `${min}${unit} - ${max}${unit}${tail}`;
    }
  }
});
</script>
