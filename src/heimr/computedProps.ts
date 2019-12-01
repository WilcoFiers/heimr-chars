import { Character, CharacterRule } from "@/types";
import { findRuleCard, parseRuleValue } from "@/heimr-data";

export const rulesetDefaults = {
  startingPoints: 20,
  startingCash: 500,
  resources: 20
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
    if (characterRule.pointsPaid !== undefined) {
      return sum + characterRule.pointsPaid;
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
        characterRule.pointsPaid !== undefined
      ) {
        return sum + characterRule.pointsPaid;
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
