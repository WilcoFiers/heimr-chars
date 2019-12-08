<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <div class="d-flex flex-grow-1">
          <h1>{{ domain.domainName }}</h1>
          <v-spacer />
          <v-btn to="../domains" text>Different domain</v-btn>
        </div>

        <DomainTabs
          :domain="domain"
          :characterRules="characterRules"
          :character="character"
        >
          <template #default="{ ruleCardGroup }">
            <RuleCardGroupPanel :ruleCardGroup="ruleCardGroup">
              <template #cardActions="{ ruleCard, restrictions }">
                <RuleCardBtnBar
                  :restrictions="restrictions"
                  :ruleCard="ruleCard"
                  @cardAction="action => cardAction({ action, ruleCard })"
                />
              </template>
            </RuleCardGroupPanel>
          </template>
        </DomainTabs>
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
                @update="updateStartingPoints"
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

    <v-dialog v-model="dialog" max-width="600">
      <RuleCardForm
        :ruleCard="customRuleCard"
        @save="addRuleCustomSave"
        @cancel="dialog = false"
        ref="form"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { domains, RuleCardGroup } from "@/heimr-data";
import { isSameCard } from "@/heimr/isSameCard";
import { getStartingPoints } from "@/heimr/computedProps";
import RuleCardBtnBar from "@/components/domain/RuleCardBtnBar.vue";
import CreationSummary from "@/components/summary/CreationSummary.vue";
import TradePointsBtn from "@/components/character/TradePointsBtn.vue";
import RuleCardGroupPanel from "@/components/domain/RuleCardGroup.vue";
import RuleCardForm from "@/components/domain/RuleCardForm.vue";

import { Domain, RuleCard, State, CharacterRule, ConditionCard } from "@/types";
import { Character, NewCharacterRule } from "@/types";

import DomainTabs from "@/components/domain/DomainTabs.vue";

type Tabs = { [propName: string]: RuleCardGroup[] };

export default Vue.extend({
  name: "DomainOverview",
  components: {
    CreationSummary,
    TradePointsBtn,
    DomainTabs,
    RuleCardGroupPanel,
    RuleCardBtnBar,
    RuleCardForm
  },
  data(): { domain: Domain; dialog: boolean; customRuleCard: RuleCard | null } {
    const domain = domains.find(({ domainName }) => {
      const match = domainName.toLowerCase().replace(/\s+/g, "_");
      return match === this.$route.params.domain;
    }) as Domain;
    const dialog = false;
    const customRuleCard: RuleCard | null = null;
    return { domain, dialog, customRuleCard };
  },

  watch: {
    dialog(val) {
      if (val === false) {
        // @ts-ignore // Cancel everything on this form
        this.$refs.form.reset();
      }
    }
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

    characterPoints() {
      let charPoints = 0;
      const { charProps } = (this.$store.state as State).character;
      if (charProps) {
        charPoints = 20 - getStartingPoints(charProps);
      }
      return charPoints;
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

    cardAction({ action, ruleCard }: { action: string; ruleCard: RuleCard }) {
      switch (action) {
        case "addRule":
          return this.addRule(ruleCard);
        case "removeRule":
          return this.removeRule(ruleCard);
        case "changeRuleLevel":
          return this.changeRuleLevel(ruleCard);
        case "addRuleCustom":
          return this.addRuleCustom(ruleCard);

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

    addRuleCustom(ruleCard: RuleCard) {
      this.dialog = true;
      this.customRuleCard = ruleCard;
    },

    addRuleCustomSave(out: Partial<NewCharacterRule>) {
      this.dialog = false;
      if (this.customRuleCard === null) {
        return;
      }
      const domainName = this.domain.domainName;
      const { type, name } = this.customRuleCard;
      const characterCard: NewCharacterRule = {
        ...out,
        type,
        name,
        domainName
      };
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
      const charUpdate: Partial<Character> = {};
      charUpdate.startingPoints = 20 - pointDifference;
      charUpdate.startingCash = 500 + pointDifference * 100;
      this.$store.dispatch("updateCharacter", charUpdate);
    }
  }
});
</script>
