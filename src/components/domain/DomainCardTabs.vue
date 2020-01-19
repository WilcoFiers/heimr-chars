<template>
  <div>
    <v-tabs v-model="activeTab" grow hide-slider>
      <v-tab v-for="tabPanel in tabs" :key="tabPanel.domainName">{{
        tabPanel.domainName
      }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item v-for="tabPanel in tabs" :key="tabPanel.domainName">
        <div
          class="pt-4"
          v-for="cardTypeGroups in tabPanel.cardGroups"
          :key="cardTypeGroups.cardType"
        >
          <h3 class="title ma-2">{{ cardTypeGroups.cardType }}</h3>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="ruleCardGroup in cardTypeGroups.groupCards"
              :key="ruleCardGroup.groupName"
            >
              <v-expansion-panel-header class="d-flex">
                <RuleCardGroupHeader :ruleCardGroup="ruleCardGroup" />
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <slot :ruleCardGroup="ruleCardGroup" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RuleCard, CharacterRule, Character, Domain } from "@/types";
import { groupCards, RuleCardGroup } from "@/heimr-data";
import RuleCardGroupHeader from "@/components/domain/RuleCardGroupHeader.vue";
import { RuleCardRestrictions } from "@/heimr/validateCardActions";

type PointsTab = {
  domainName: string;
  cardGroups: {
    cardType: string;
    groupCards: RuleCardGroup[];
  }[];
};

export default Vue.extend({
  name: "DomainCardTabs",
  components: {
    RuleCardGroupHeader
  },
  props: {
    domains: {
      type: Array,
      required: true
    },
    character: {
      type: Object,
      required: true
    },
    characterRules: {
      type: Array,
      required: true
    }
  },

  data() {
    return { activeTab: null };
  },

  computed: {
    tabs() {
      const charProps = this.character as Character;
      const rules = this.characterRules as CharacterRule[];

      // const tabs: TabPanel[] = [];
      const tabs: PointsTab[] = (this.domains as Domain[]).map(
        ({ domainName, skills, conditions, items, consumables }): PointsTab => {
          const cardGroups = [];
          if (skills && skills.length > 1) {
            cardGroups.push({
              cardType: "Skills",
              groupCards: groupCards(charProps, rules, domainName, skills)
            });
          }

          if (conditions && conditions.length > 1) {
            cardGroups.push({
              cardType: "Conditions",
              groupCards: groupCards(charProps, rules, domainName, conditions)
            });
          }

          if (items && items.length > 1) {
            cardGroups.push({
              cardType: "Items",
              groupCards: groupCards(charProps, rules, domainName, items)
            });
          }

          if (consumables && consumables.length > 1) {
            cardGroups.push({
              cardType: "Consumables",
              groupCards: groupCards(charProps, rules, domainName, consumables)
            });
          }
          return { domainName, cardGroups };
        }
      );
      return tabs;
    }
  }
});
</script>
