<template>
  <div>
    <v-tabs v-model="activeTab" grow>
      <v-tab v-for="(_, cardType) in tabs" :key="cardType">
        {{ cardType }}
        <v-icon small right color="primary" v-if="ownsInGroup(cardType)"
          >mdi-star-outline</v-icon
        >
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item v-for="(ruleCardGroups, cardType) in tabs" :key="cardType">
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
                >
                  <template #cardActions="{ ruleCard, restrictions }">
                    <slot
                      name="cardActions"
                      :ruleCard="ruleCard"
                      :restrictions="restrictions"
                    />
                  </template>
                </RuleCardGroupPanel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RuleCard, CharacterRule, Character } from "@/types";
import { groupCards, RuleCardGroup } from "@/heimr-data";
import RuleCardGroupPanel from "@/components/domain/RuleCardGroup.vue";

type Tabs = { [propName: string]: RuleCardGroup[] };

export default Vue.extend({
  name: "DomainTabs",
  components: {
    RuleCardGroupPanel
  },
  props: {
    domain: {
      type: Object,
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
    }
  },

  methods: {
    ownsInGroup(cardType: string): boolean {
      if (!this.tabs[cardType]) {
        return false;
      }
      return this.tabs[cardType].some(ruleCardGroup => {
        return ruleCardGroup.ruleCards.some(({ restrictions }) => {
          return restrictions.owned > 0;
        });
      });
    }
  }
});
</script>
