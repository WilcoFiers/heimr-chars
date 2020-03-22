<template>
  <div>
    <DomainCardTabs
      v-if="character"
      :domains="domains"
      :character="character"
      :characterRules="characterRules"
    >
      <template #default="{ ruleCardGroup }">
        <RuleCardGroup :ruleCardGroup="ruleCardGroup">
          <template #cardActions="{ ruleCard, restrictions }">
            <RuleCardBtnBar
              :restrictions="restrictions"
              :ruleCard="ruleCard"
              :allowDormant="allowDormant(ruleCard)"
              @cardAction="action => cardAction({ action, ruleCard })"
            />
          </template>
        </RuleCardGroup>
      </template>
    </DomainCardTabs>

    <v-dialog v-model="dialog" max-width="600">
      <RuleCardForm
        :ruleCard="customRuleCard"
        :requiredOnly="ruleCardFormRequiredOnly"
        @save="addRuleCustomSave"
        @cancel="dialog = false"
        ref="form"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Character,
  NewCharacterRule,
  Domain,
  RuleCard,
  State,
  CharacterRule,
  ConditionCard
} from "@/types";

import { isSameCard } from "@/heimr/isSameCard";
import { getFormData } from "@/heimr/rule-card-customize";
import { CharacterState } from "@/store/character";
import { domains } from "@/heimr-data";

import DomainCardTabs from "@/components/domain/DomainCardTabs.vue";
import RuleCardGroup from "@/components/domain/RuleCardGroup.vue";
import RuleCardBtnBar from "@/components/domain/RuleCardBtnBar.vue";
import RuleCardForm from "@/components/domain/RuleCardForm.vue";

import { getStartingPoints, getFreeDormant } from "@/heimr/characterProps";

type DomainOverviewData = {
  dialog: boolean;
  customRuleCard: RuleCard | null;
  ruleCardFormRequiredOnly: boolean;
};

export function activeDomains({
  selectedDomains,
  rules = []
}: CharacterState): Domain[] {
  const locked = new Set();
  rules.forEach(({ domainName }) => locked.add(domainName));

  return domains.filter(
    ({ domainName }) =>
      selectedDomains.includes(domainName) ||
      Array.from(locked).includes(domainName)
  );
}

export default Vue.extend({
  name: "BaseCharacterCard",
  components: {
    DomainCardTabs,
    RuleCardGroup,
    RuleCardBtnBar,
    RuleCardForm
  },
  props: {
    domains: {
      type: Array,
      required: true
    }
  },

  data(): DomainOverviewData {
    const dialog = false;
    const ruleCardFormRequiredOnly = false;
    const customRuleCard: RuleCard | null = null;
    return { dialog, customRuleCard, ruleCardFormRequiredOnly };
  },

  computed: {
    character(): Character | undefined {
      return (this.$store.state as State).character.charProps;
    },
    characterRules(): CharacterRule[] {
      return (this.$store.state as State).character.rules || [];
    },

    characterPoints() {
      let charPoints = 0;
      if (this.character) {
        // TODO: remove hard-coded value, use $store.getter
        charPoints = 20 - getStartingPoints(this.character);
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

    domainName({ name, type }: RuleCard): string {
      const domain = (this.domains as Domain[]).find(domain => {
        // @ts-ignore
        return domain[`${type}s`].some(card => card.name === name);
      });
      if (!domain) {
        throw new Error(`Could not find domain of ${name}`);
      }
      return domain.domainName;
    },

    cardAction({ action, ruleCard }: { action: string; ruleCard: RuleCard }) {
      this.$emit("action", { action, ruleCard });
      switch (action) {
        case "addRule":
          return this.addRule(ruleCard);
        case "removeRule":
          return this.removeRule(ruleCard);
        case "changeRuleLevel":
          return this.changeRuleLevel(ruleCard);
        case "addDormantSkill":
          return this.addRule(ruleCard, true);
        case "addRuleCustom":
          return this.addRuleCustom(ruleCard);

        default:
          throw new Error(
            `Unknown cardAction '${action}' on '${ruleCard.name}'`
          );
      }
    },

    addRule(ruleCard: RuleCard, inactive: boolean = false) {
      if (inactive && ruleCard.type !== "skill") {
        throw new Error(
          `Card ${ruleCard.name} can not be dormant, because it is not a skill`
        );
      }
      const formData = getFormData(ruleCard, { requiredOnly: true });
      const hasRequired = Object.values(formData).some(
        val => typeof val !== "undefined"
      );
      if (hasRequired) {
        this.dialog = true;
        this.customRuleCard = ruleCard;
        this.ruleCardFormRequiredOnly = true;
        return;
      }
      const domainName = this.domainName(ruleCard);
      const { type, name } = ruleCard;
      const newCharRule: NewCharacterRule = {
        type,
        name,
        domainName,
        inactive
      };
      this.$store.dispatch("addCharacterRule", newCharRule);
    },

    addRuleCustom(ruleCard: RuleCard) {
      this.dialog = true;
      this.customRuleCard = ruleCard;
      this.ruleCardFormRequiredOnly = false;
    },

    addRuleCustomSave(out: Partial<NewCharacterRule>) {
      this.dialog = false;
      if (this.customRuleCard === null) {
        return;
      }
      const domainName = this.domainName(this.customRuleCard);
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
      this.$store.dispatch("updateCharacterRule", {
        id: charRules[0].id,
        name: ruleCard.name
      });
    },

    updateStartingPoints(pointDifference: number) {
      const charUpdate: Partial<Character> = {};
      charUpdate.startingPoints = 20 - pointDifference;
      charUpdate.startingCash = 500 + pointDifference * 100;
      this.$store.dispatch("updateCharacter", charUpdate);
    },

    allowDormant(ruleCard: RuleCard): boolean {
      const { charProps } = (this.$store.state as State).character;
      if (ruleCard.type !== "skill" || !charProps) {
        return false;
      }
      return getFreeDormant(charProps) > 0;
    }
  }
});
</script>
