<template>
  <v-dialog v-bind="$attrs" :value="value" @input="$emit('input', $event)">
    <v-card>
      <v-card-title v-text="title" />
      <v-list class="height-80vh" v-if="action === 'add' && !currentDomain">
        <v-list-item
          v-for="domainName in domainNames"
          :key="domainName"
          v-text="domainName"
          @click="currentDomain = domainName"
        />
      </v-list>

      <div class="height-80vh" v-else>
        <v-expansion-panels class="no-top-radius" v-model="expandPanel">
          <RuleExpansionPanel
            v-for="({ ruleCard, characterRule }, index) in cards"
            :key="index"
            :characterRule="characterRule"
            :ruleCard="ruleCard"
          >
            <div class="text-right">
              <v-btn
                class="primary"
                :disabled="disabledItems.includes(ruleCard.name)"
                v-text="action"
                @click="completeAction(characterRule)"
              />
            </div>
          </RuleExpansionPanel>
        </v-expansion-panels>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { CharacterRule, RuleCard, DowntimeItem } from "@/types";
import { findRuleCard, domains } from "@/heimr-data";
import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";

type CardSet =
  | {
      ruleCard: RuleCard | null;
      characterRule: CharacterRule;
    }
  | {
      ruleCard: RuleCard;
      characterRule: CharacterRule | null;
    };

export default Vue.extend({
  name: "DowntimeItemDialog",
  components: { RuleExpansionPanel },
  props: {
    title: String,
    cardType: String,
    action: String,
    value: Boolean,
    charRules: Array,
    downtimeItems: Array
  },

  data() {
    return {
      expandPanel: -1 as number,
      domainNames: domains.map(({ domainName }) => domainName) as string[],
      currentDomain: "" as string
    };
  },

  computed: {
    disabledItems(): string[] {
      const subTitles: string[] = [];
      (this.downtimeItems as DowntimeItem[]).forEach(
        (downtimeItem: DowntimeItem) => {
          if (downtimeItem.subTitle) {
            subTitles.push(downtimeItem.subTitle);
          }
        }
      );
      return subTitles;
    },

    addableCards(): CardSet[] {
      const domain = domains.find(
        ({ domainName }) => domainName === this.currentDomain
      );
      if (!domain) {
        return [];
      }
      // @ts-ignore
      const ruleCards: RuleCard[] = domain[this.cardType + "s"];
      return ruleCards.map(ruleCard => ({ ruleCard, characterRule: null }));
    },

    removableCards(): CardSet[] {
      const activeCharCards = (this.charRules as CharacterRule[]).filter(
        ({ type, dormant }) => type === this.cardType && !dormant
      );
      return activeCharCards.map(
        (characterRule): CardSet => ({
          characterRule,
          ruleCard: findRuleCard(characterRule)
        })
      );
    },

    dormantCards(): CardSet[] {
      const dormantCharCards = (this.charRules as CharacterRule[]).filter(
        ({ type, dormant }) => type === this.cardType && dormant
      );
      return dormantCharCards.map(
        (characterRule): CardSet => ({
          characterRule,
          ruleCard: findRuleCard(characterRule)
        })
      );
    },

    upgradableCards(): CardSet[] {
      return this.removableCards;
    },

    cards(): CardSet[] {
      if (this.action === "dormant") {
        return this.dormantCards;
      }
      if (this.action === "upgrade") {
        return this.upgradableCards;
      }
      if (this.action === "remove") {
        return this.removableCards;
      }
      if (this.action === "add") {
        return this.addableCards;
      }
      return [];
    }
  },

  methods: {
    findRuleCard,
    completeAction(characterRule: CharacterRule) {
      this.$emit("action", {
        action: this.action,
        title: this.title,
        cost: 0,
        subTitle: characterRule.name,
        type: characterRule.type,
        domainName: characterRule.domainName,
        id: characterRule.id
      });
      this.$emit("input", false);
    }
  },

  watch: {
    value(newVal) {
      if (newVal === false) {
        this.expandPanel = -1;
        this.currentDomain = "";
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.height-80vh {
  height: calc(80vh - 56px);
  overflow: auto;
}
</style>
