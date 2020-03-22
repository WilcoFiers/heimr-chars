<template>
  <v-dialog v-bind="$attrs" :value="value" @input="$emit('input', $event)">
    <v-card>
      <v-card-title v-text="title" />
      <v-list class="height-80vh" v-if="activity === 'add' && !currentDomain">
        <v-list-item
          v-for="domain in domains"
          :key="domain.domainName"
          @click="currentDomain = domain.domainName"
          :disabled="domain[cardType + 's'].length === 0"
        >
          <v-list-item-avatar>
            <IconImage :asset="domainImg(domain)" />
          </v-list-item-avatar>
          <v-list-item-content v-text="domain.domainName" />
        </v-list-item>
      </v-list>

      <div class="height-80vh" v-else>
        <v-expansion-panels class="no-top-radius" v-model="expandPanel">
          <RuleExpansionPanel
            v-for="({ ruleCard, characterRule }, index) in cards"
            :key="index"
            :characterRule="characterRule"
            :ruleCard="ruleCard"
          >
            <DowntimeItemForm
              :activity="activity"
              :characterRule="characterRule"
              :ruleCard="ruleCard"
              :disabled="disabledItems.includes(ruleCard.name)"
              @submit="completeDowntimeItem"
              ref="downtimeItemForms"
            />
          </RuleExpansionPanel>
        </v-expansion-panels>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { CharacterRule, RuleCard, NewDowntimeItem, Domain } from "@/types";
import { findRuleCard, domains, domainImg } from "@/heimr-data";

import RuleExpansionPanel from "@/components/domain/RuleExpansionPanel.vue";
import DowntimeItemForm, {
  PartialDowntimeItem
} from "@/components/downtime/DowntimeItemForm.vue";
import IconImage from "@/components/IconImage.vue";

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
  components: { RuleExpansionPanel, IconImage, DowntimeItemForm },
  props: {
    title: String,
    cardType: String,
    activity: String,
    value: Boolean,
    charRules: Array,
    downtimeItems: Array
  },

  data() {
    return {
      expandPanel: -1 as number,
      domains: domains as Domain[],
      currentDomain: "" as string
    };
  },

  computed: {
    disabledItems(): string[] {
      const cardNames: string[] = [];
      (this.downtimeItems as NewDowntimeItem[]).forEach(
        (downtimeItem: NewDowntimeItem) => {
          if (downtimeItem.cardName) {
            cardNames.push(downtimeItem.cardName);
          }
        }
      );
      return cardNames;
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
        ({ type, inactive }) => type === this.cardType && !inactive
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
        ({ type, inactive }) => type === this.cardType && inactive
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
      if (this.activity === "dormant") {
        return this.dormantCards;
      }
      if (this.activity === "upgrade") {
        return this.upgradableCards;
      }
      if (this.activity === "remove") {
        return this.removableCards;
      }
      if (this.activity === "add") {
        return this.addableCards;
      }
      return [];
    }
  },

  methods: {
    findRuleCard,
    domainImg,

    completeDowntimeItem(formData: {
      downtimeItem: PartialDowntimeItem;
      downtimeProp: string;
    }) {
      const partialDowntimeItem = formData.downtimeItem;
      const downtimeProp = formData.downtimeProp;

      const downtimeItem = {
        activity: this.activity,
        title: this.title,
        cost: partialDowntimeItem.cost || 0,
        domainName: partialDowntimeItem.domainName || this.currentDomain,
        cardName: String(partialDowntimeItem.cardName),
        type: partialDowntimeItem.type
      } as NewDowntimeItem;

      if (partialDowntimeItem.id) {
        downtimeItem.id = partialDowntimeItem.id;
      }

      if (partialDowntimeItem.cardNameDetails) {
        downtimeItem.cardNameDetails = partialDowntimeItem.cardNameDetails;
      }

      this.$emit("submit", { downtimeItem, downtimeProp });
      this.$emit("input", false);
    }
  },

  watch: {
    value(newVal) {
      if (newVal === false) {
        this.expandPanel = -1;
        this.currentDomain = "";
        // @ts-ignore
        (this.$refs.downtimeItemForms || []).forEach(form => form.reset());
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
