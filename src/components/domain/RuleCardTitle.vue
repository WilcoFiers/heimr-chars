<template>
  <div class="d-flex flex-grow-1 align-baseline">
    <h4 :class="heading">
      <span>{{ ruleCard.name }}</span>
      <v-icon small v-if="quantity" color="primary" right
        >mdi-check-bold</v-icon
      >
    </h4>
    <v-spacer />
    <span v-if="pricePaid" :class="{ 'grey--text': pricePaid.custom }">{{
      pricePaid.value
    }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RaceCard } from "@/types";
import { getRulePoints, getRulePrice } from "@/heimr/characterCardProps";

export default Vue.extend({
  name: "RuleCardTitle",
  props: {
    ruleCard: Object,
    characterRule: Object,
    quantity: Number,
    multiple: Boolean,
    heading: String
  },
  computed: {
    pricePaid(): { value: string; custom: boolean } | null {
      const { characterRule, ruleCard } = this;
      if (ruleCard.type === "race" || typeof characterRule !== "object") {
        return null;
      }
      if (characterRule.dormant) {
        return {
          value: "dormant",
          custom: true
        };
      }

      const points = getRulePoints(characterRule, ruleCard);
      if (points) {
        return {
          value: `${points} points`,
          custom: ruleCard.points !== points
        };
      }

      const pricePaid = getRulePrice(characterRule, ruleCard);
      if (pricePaid) {
        const isSpecial = ["var", "free"].includes(
          ruleCard.marketPrice.toLowerCase()
        );
        return {
          value: `${pricePaid}¢`,
          custom: ruleCard.marketPrice !== pricePaid && isSpecial
        };
      }
      return null;
    }
  },
  methods: {
    loreName({ name }: RaceCard) {
      return name.split(" ")[0].toLowerCase();
    }
  }
});
</script>
