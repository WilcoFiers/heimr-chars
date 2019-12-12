<template>
  <div class="d-flex">
    <h3>
      {{ ruleGroupLevelText }}
      <v-icon small color="primary" v-if="groupIcon">{{ groupIcon }}</v-icon>
    </h3>
    <v-spacer />
    <span class="flex-grow-0 mr-5">{{ ruleGroupCostText }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RuleCardGroup } from "@/heimr-data";
import { ruleGroupCostText, ruleGroupLevelText } from "@/heimr/ruleGroup";

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
      return ruleGroupLevelText(this.ruleCardGroup);
    },

    ruleGroupCostText(): string {
      return ruleGroupCostText(this.ruleCardGroup);
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
    }
  }
});
</script>
