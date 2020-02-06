<template>
  <div>
    <div v-if="ruleCard.type === 'race'">
      {{ raceMeta.description }}
      <a
        :href="raceMeta.url"
        target="blank"
        :title="`More about ${raceMeta.plural}`"
        >Learn more</a
      >
    </div>

    <v-row>
      <v-col v-if="ruleCard.type === 'race'">
        <strong>Hitpoints:</strong>
        {{ ruleCard.hitpoints }}
      </v-col>
      <v-col v-if="ruleCard.type === 'race'">
        <strong>Willpower:</strong>
        {{ ruleCard.willpower }}
      </v-col>

      <v-col v-if="ruleCard.points">
        <strong>Points:</strong>
        {{ ruleCard.points }}
      </v-col>
      <v-col v-if="ruleCard.points && ruleCard.type === 'skill'">
        <strong>Monthly cost:</strong>
        {{ ruleCard.points }}&nbsp;ℜ
      </v-col>

      <v-col v-if="ruleCard.marketPrice">
        <strong>Market price:</strong>
        {{ ruleCard.marketPrice }}
      </v-col>
      <v-col v-if="ruleCard.restorePrice">
        <strong>Restore price:</strong>
        {{ ruleCard.restorePrice }}
      </v-col>

      <v-col v-if="ruleCard.toughness">
        <strong>Toughness:</strong>
        {{ ruleCard.toughness }}
      </v-col>
      <v-col v-if="ruleCard.large">
        <strong>Large</strong>
      </v-col>
    </v-row>

    <p v-if="ruleCard.details" class="mt-2">
      <i>{{ ruleCard.details }}</i>
    </p>

    <p v-if="ruleCard.requires">
      <strong>Requires:</strong>
      {{ ruleCard.requires }}
    </p>
    <div v-if="ruleCard.uniqueRules">
      <h4>Unique rules</h4>
      <ul>
        <li v-for="(rule, i) in ruleCard.uniqueRules" :key="i">{{ rule }}</li>
      </ul>
    </div>
    <div v-if="ruleCard.sharedRules" class="mt-2">
      <h4>Shared rules</h4>
      <ul>
        <li v-for="(rule, i) in ruleCard.sharedRules" :key="i">{{ rule }}</li>
      </ul>
    </div>
    <div v-if="ruleCard.downtimeRules" class="mt-2">
      <h4>Downtime rules</h4>
      <ul>
        <li v-for="(rule, i) in ruleCard.downtimeRules" :key="i">{{ rule }}</li>
      </ul>
    </div>

    <div v-if="ruleCard.replaceLevel && ruleCard.replaceCard" class="mt-2">
      <h4>Replace rule</h4>
      <p class="pl-4">
        At
        <em v-text="`Surgery ${ruleCard.replaceLevel}`" /> this becomes
        <em v-text="`'${ruleCard.replaceCard}'`" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RaceCard } from "@/types";
import { getRaceMeta, RaceMeta } from "@/heimr-data";

export default Vue.extend({
  name: "RuleCardContent",
  props: {
    ruleCard: Object
  },
  computed: {
    raceMeta(): Partial<RaceMeta> {
      if (this.ruleCard.type !== "race") {
        return {};
      }
      return getRaceMeta(this.ruleCard) || {};
    }
  },
  methods: {
    loreName({ name }: RaceCard) {
      return name.split(" ")[0].toLowerCase();
    }
  }
});
</script>
