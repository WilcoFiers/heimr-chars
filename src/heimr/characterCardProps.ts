import { Character, CharacterRule, RuleCard } from "@/types";
import { findRuleCard, parseRuleValue } from "@/heimr-data";
import { getCharacterProps } from "./characterProps";

export const getRulePoints = (
  characterRule: CharacterRule,
  ruleCard: RuleCard
): number | void => {
  if (characterRule.points !== undefined) {
    return characterRule.points;
  }
  if (ruleCard.type === "skill" || ruleCard.type === "condition") {
    return ruleCard.points;
  }
};

export const getRulePrice = (
  characterRule: CharacterRule,
  ruleCard: RuleCard
): number | void => {
  if (characterRule.cashPaid !== undefined) {
    return characterRule.cashPaid;
  }
  if (ruleCard.type === "item" || ruleCard.type === "consumable") {
    const { value } = parseRuleValue(ruleCard.marketPrice) || {
      value: undefined
    };
    return value;
  }
};

export const getPointsSpent = (
  characterRules: CharacterRule[],
  dormant = false
): number => {
  return characterRules.reduce((sum: number, characterRule) => {
    if (characterRule.points !== undefined) {
      return sum + characterRule.points;
    }
    const ruleCard = findRuleCard(characterRule);
    if (
      !ruleCard ||
      ruleCard.type === "item" ||
      ruleCard.type === "consumable"
    ) {
      return sum;
    }
    if (!!characterRule.dormant !== dormant) {
      return sum;
    }
    return sum + (ruleCard.points || 0);
  }, 0);
};

export const getCashSpent = (characterRules: CharacterRule[]): number => {
  return characterRules.reduce((sum: number, characterRule) => {
    if (characterRule.cashPaid !== undefined) {
      return sum + characterRule.cashPaid;
    }

    const ruleCard = findRuleCard(characterRule);
    if (
      ruleCard &&
      (ruleCard.type === "item" || ruleCard.type === "consumable") &&
      ruleCard.marketPrice !== undefined
    ) {
      const { value = 0 } = parseRuleValue(ruleCard.marketPrice) || {};
      return sum + value;
    }
    return sum;
  }, 0);
};

export function getMonthlySavings(
  character: Character,
  characterRules: CharacterRule[]
): number {
  const skillPointCount = characterRules.reduce(
    (sum, characterRule): number => {
      if (
        characterRule.type === "skill" &&
        characterRule.points !== undefined
      ) {
        return sum + characterRule.points;
      }

      const ruleCard = findRuleCard(characterRule);
      if (
        ruleCard &&
        ruleCard.type === "skill" &&
        ruleCard.points !== undefined
      ) {
        return sum + ruleCard.points;
      }
      return sum;
    },
    0
  );
  const { monthlyResources, costOfLiving, resourceToCash } = getCharacterProps(
    character
  );
  const remainder =
    monthlyResources - Math.round(costOfLiving / resourceToCash);
  return remainder - skillPointCount;
}
