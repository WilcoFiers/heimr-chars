<template>
  <div class="d-flex flex-grow-1">
    <h3>
      <span>{{ ruleCard.name }}</span>
      <v-icon small v-if="quantity" color="primary" right
        >mdi-check-bold</v-icon
      >
    </h3>
    <v-spacer />

    <a
      v-if="ruleCard.type === 'race'"
      target="blank"
      :href="'http://heimr.nl/in_character/lore/' + loreName(ruleCard)"
      :title="'Heimr lore for ' + loreName(ruleCard)"
      >lore</a
    >
    <span v-else-if="pricePaid" :class="{ 'purple--text': pricePaid.custom }">{{
      pricePaid.value
    }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RaceCard } from "@/types";
import { getRulePoints, getRulePrice } from "@/heimr/computedProps";

export default Vue.extend({
  name: "RuleCardTitle",
  props: {
    ruleCard: Object,
    characterRule: Object,
    quantity: Number,
    multiple: Boolean
  },
  computed: {
    pricePaid(): { value: string; custom: boolean } | null {
      const { characterRule, ruleCard } = this;
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
