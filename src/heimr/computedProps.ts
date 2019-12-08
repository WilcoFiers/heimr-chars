import { Character, CharacterRule, RuleCard } from "@/types";
import { findRuleCard, parseRuleValue } from "@/heimr-data";

export const rulesetDefaults = {
  startingPoints: 20,
  startingCash: 500,
  resources: 20
};

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

export const getStartingPoints = (character: Character): number => {
  if (character.startingPoints === undefined) {
    return rulesetDefaults.startingPoints;
  }
  return character.startingPoints;
};

export const getStartingCash = (character: Character): number => {
  if (character.startingCash === undefined) {
    return rulesetDefaults.startingCash;
  }
  return character.startingCash;
};

export const getPointsSpent = (characterRules: CharacterRule[]): number => {
  return characterRules.reduce((sum: number, characterRule) => {
    if (characterRule.points !== undefined) {
      return sum + characterRule.points;
    }

    const ruleCard = findRuleCard(characterRule);
    if (
      ruleCard &&
      (ruleCard.type === "skill" || ruleCard.type === "condition") &&
      ruleCard.points !== undefined
    ) {
      return sum + ruleCard.points;
    }
    return sum;
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
  return getStartingPoints(character) - skillPointCount;
}
