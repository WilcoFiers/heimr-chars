<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="d-flex">
      <h3>
        {{ ruleCardGroup.groupName }}{{ ruleGroupLevelText }}
        <v-icon small color="primary" v-if="groupIcon">{{ groupIcon }}</v-icon>
      </h3>
      <v-spacer />
      <span class="flex-grow-0 mr-5">{{ ruleGroupCostText }}</span>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-row class="flex-row-reverse">
        <v-col class="py-0" v-if="multiple" :cols="3">
          <v-list class="py-0">
            <v-list-item-group v-model="level" color="primary" mandatory>
              <v-list-item
                v-for="(ruleCard, i) in ruleCardGroup.ruleCards"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    Level {{ i + 1 }}
                    <v-icon
                      v-if="ruleCard.restrictions.owned > 0"
                      small
                      color="blue"
                      >mdi-star</v-icon
                    >
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-avatar v-if="ruleCard.points"
                  >{{ ruleCard.points }}pts</v-list-item-avatar
                >
                <v-list-item-avatar v-else-if="ruleCard.marketPrice"
                  >{{ ruleCard.marketPrice }} ¢</v-list-item-avatar
                >
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>

        <v-col class="pt-0">
          <RuleCardContent :ruleCard="ruleCard" />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <slot
            name="cardActions"
            :ruleCard="ruleCard"
            :restrictions="restrictions"
          />
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import RuleCardContent from "./RuleCardContent.vue";
import { RuleCard } from "@/types";
import { RuleCardRestrictions } from "@/heimr/validateCardActions";
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
  name: "RuleCardGroup",
  components: { RuleCardContent },
  props: {
    ruleCardGroup: {
      type: Object
    }
  },
  data() {
    return {
      level: 0
    };
  },

  computed: {
    multiple(): boolean {
      return this.ruleCardGroup.ruleCards.length > 1;
    },
    ruleCard(): RuleCard {
      const { ruleCard } = this.ruleCardGroup.ruleCards[this.level];
      return ruleCard;
    },
    restrictions(): RuleCardRestrictions {
      const { restrictions } = this.ruleCardGroup.ruleCards[this.level];
      return restrictions;
    },

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
  },

  methods: {
    cardAction(action: string) {
      this.$emit("cardAction", { action, ruleCard: this.ruleCard });
    }
  }
});
</script>
