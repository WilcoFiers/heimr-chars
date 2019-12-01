<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <div class="d-flex flex-grow-1">
          <h1>{{ domain.domainName }}</h1>
          <v-spacer />
          <v-btn to="../domains" text>Different domain</v-btn>
        </div>

        <v-tabs v-model="activeTab" grow>
          <v-tab v-for="(_, cardType) in tabs" :key="cardType">
            {{ cardType }}
            <v-icon small right color="primary" v-if="ownsInGroup(cardType)"
              >mdi-star-outline</v-icon
            >
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <v-tab-item
            v-for="(ruleCardGroups, cardType) in tabs"
            :key="cardType"
          >
            <v-container>
              <v-row v-if="ruleCardGroups.length === 0">
                <v-col>
                  <p>No cards in this domain</p>
                </v-col>
              </v-row>

              <v-row v-else>
                <v-col>
                  <v-expansion-panels>
                    <RuleCardGroupPanel
                      v-for="ruleCardGroup in ruleCardGroups"
                      :key="ruleCardGroup.groupName"
                      :ruleCardGroup="ruleCardGroup"
                      @cardAction="cardAction"
                    />
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-col>

      <v-col cols="3">
        <CreationSummary
          :characterRules="characterRules"
          :character="character"
        >
          <v-row>
            <v-col>
              <TradePointsBtn
                block
                color="primary"
                :value="characterPoints"
                @updateStartingPoints="updateStartingPoints"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-btn block :to="`/characters/${$route.params.charId}/resources`"
                >Details</v-btn
              >
            </v-col>
          </v-row>
        </CreationSummary>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { domains, groupCards, RuleCardGroup } from "@/heimr-data";
import { isSameCard } from "@/heimr/isSameCard";
import { getStartingPoints } from "@/heimr/computedProps";
import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";
import RuleCardGroupPanel from "@/components/domain/RuleCardGroup.vue";
import CreationSummary from "@/components/summary/CreationSummary.vue";
import TradePointsBtn from "@/components/character/TradePointsBtn.vue";
import { getCharacterRulesCol } from "@/firebase";
import { Domain, RuleCard, State, CharacterRule, ConditionCard } from "@/types";
import { Character } from "@/types";

type Tabs = { [propName: string]: RuleCardGroup[] };

export default Vue.extend({
  name: "DomainOverview",
  components: { CreationSummary, RuleCardGroupPanel, TradePointsBtn },
  data() {
    const activeTab = null;
    const domain = domains.find(({ domainName }) => {
      const match = domainName.toLowerCase().replace(/\s+/g, "_");
      return match === this.$route.params.domain;
    }) as Domain;

    return { domain, activeTab };
  },

  computed: {
    character(): Partial<Character> {
      const { charProps } = (this.$store.state as State).character;
      return charProps || {};
    },

    characterRules(): CharacterRule[] {
      const { rules } = (this.$store.state as State).character;
      return rules || [];
    },

    tabs() {
      const { charProps, rules } = (this.$store.state as State).character;

      const tabs: Tabs = {};
      if (charProps && rules) {
        const groupCardsMapping = (cards?: RuleCard[]) =>
          groupCards(charProps, rules, this.domain.domainName, cards);

        tabs.Skills = groupCardsMapping(this.domain.skills);
        tabs.Conditions = groupCardsMapping(this.domain.conditions);
        tabs.Items = groupCardsMapping(this.domain.items);
        tabs.Consumables = groupCardsMapping(this.domain.consumables);
      }
      return tabs;
    },

    characterPoints() {
      const { charProps } = (this.$store.state as State).character;
      if (charProps) {
        return getStartingPoints(charProps);
      }
      return 20;
    }
  },

  methods: {
    findCharacterRules(
      ruleCard: RuleCard,
      anyLevel?: boolean
    ): CharacterRule[] {
      return this.characterRules.filter(charRule =>
        isSameCard(charRule, ruleCard, anyLevel)
      );
    },

    ownsInGroup(cardType: string): boolean {
      if (!this.tabs[cardType]) {
        return false;
      }
      return this.tabs[cardType].some(ruleCardGroup => {
        return ruleCardGroup.ruleCards.some(({ restrictions }) => {
          return restrictions.owned > 0;
        });
      });
    },

    cardAction({ action, ruleCard }: { action: string; ruleCard: RuleCard }) {
      switch (action) {
        case "addRule":
          return this.addRule(ruleCard);
        case "removeRule":
          return this.removeRule(ruleCard);
        case "changeRuleLevel":
          return this.changeRuleLevel(ruleCard);

        default:
          throw new Error(
            `Unknown cardAction '${action}' on '${ruleCard.name}'`
          );
      }
    },

    addRule(rule: RuleCard) {
      const domainName = this.domain.domainName;
      const { type, name } = rule;
      const characterCard = { type, name, domainName };
      this.$store.dispatch("addCharacterRule", characterCard);
    },

    removeRule(ruleCard: RuleCard) {
      const charRules = this.findCharacterRules(ruleCard);
      if (charRules.length) {
        this.$store.dispatch("removeCharacterRule", charRules[0].id);
      }
    },

    changeRuleLevel(ruleCard: RuleCard) {
      const charRules = this.findCharacterRules(ruleCard, true);
      if (charRules.length !== 1) {
        throw new Error(
          `Cannot upgrade. More than one characterRule matches ${ruleCard.name}`
        );
      }
      this.$store.dispatch("changeCharacterRule", {
        id: charRules[0].id,
        name: ruleCard.name
      });
    },

    updateStartingPoints(pointDifference: number) {
      const charUpdate = {} as Character;
      charUpdate.startingPoints = 20 - pointDifference;
      charUpdate.startingCash = 500 + pointDifference * 100;
      this.$store.dispatch("updateCharacter", charUpdate);
    }
  }
});
</script>
