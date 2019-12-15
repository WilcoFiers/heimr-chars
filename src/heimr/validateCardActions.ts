import { Character, RuleCard, CharacterRule } from "@/types";
import { isSameCard } from "./isSameCard";
import { multiCardRuleMatches, cardMatchesRule } from "./rule-regex";

export type ValidationIssues = string[];

type ValidationActionArgs = [Character, CharacterRule[], RuleCard, string];
type ValidationAction = (...args: ValidationActionArgs) => ValidationIssues;

/**
 * Return all CharacterCards that match the RuleCard
 */
export const charCardsOwned = (
  charRules: CharacterRule[],
  ruleCard: RuleCard,
  anyLevel?: boolean
): CharacterRule[] => {
  return charRules.filter(charRule => isSameCard(charRule, ruleCard, anyLevel));
};

export const cardIsOwned = (
  charRules: CharacterRule[],
  ruleCard: RuleCard,
  anyLevel?: boolean
): boolean => {
  return charRules.some(charRule => isSameCard(charRule, ruleCard, anyLevel));
};

export const canOwnMultiple = (ruleCard: RuleCard): boolean => {
  const isMultiOwnedType = ["item", "consumable"].includes(ruleCard.type);
  if (isMultiOwnedType) {
    return isMultiOwnedType;
  }
  return !!cardMatchesRule(ruleCard, multiCardRuleMatches);
};

export const hasRequired = (
  charRules: CharacterRule[],
  ruleCard: RuleCard
): boolean => {
  if (
    ruleCard.type === "item" ||
    ruleCard.type === "consumable" ||
    !ruleCard.requires
  ) {
    return true; // These don't have requirements
  }

  function simplifyText(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z\s]/gi, "")
      .trim();
  }

  const requires = ruleCard.requires.toLowerCase();
  return charRules.some(charRule => {
    return !charRule.dormant && requires.includes(simplifyText(charRule.name));
  });
};

export const validateCardAdd: ValidationAction = (
  character,
  charRules,
  ruleCard,
  domainName
) => {
  const issues: ValidationIssues = [];
  const isOwned = cardIsOwned(charRules, ruleCard);
  if (isOwned && !canOwnMultiple(ruleCard)) {
    issues.push(`${character.name} already owns ${ruleCard.name}`);
  }

  if (!isOwned && cardIsOwned(charRules, ruleCard, true)) {
    issues.push(`${character.name} owns another level of ${ruleCard.name}`);
  }
  if (!hasRequired(charRules, ruleCard)) {
    // @ts-ignore // Yes, ruleCard.requires is defined
    const requires = ruleCard.requires;
    issues.push(
      `${character.name} does not meet the requirement "${requires}"`
    );
  }

  // Check that the player has enough points

  return issues;
};

export const validateCardRemove: ValidationAction = (
  character,
  charRules,
  ruleCard,
  domainName
) => {
  const issues: ValidationIssues = [];
  if (!cardIsOwned(charRules, ruleCard)) {
    issues.push(`${character.name} dows not own ${ruleCard.name}`);
  }

  // if (false) {
  //   issues.push(`${ruleCard.name} is required for {otherCard}`)
  // }
  // if (false) {
  //   issues.push(`${ruleCard.name} skill has already been played with. Make the skill dormant instead.`)
  // }
  // if (false) {
  //   issues.push(`${ruleCard.name} item has already been in play. Sell the item instead.`)
  // }

  return issues;
};

export const validateLevelChange: ValidationAction = (
  character,
  charRules,
  ruleCard,
  domainName
) => {
  const issues: ValidationIssues = [];

  if (!cardIsOwned(charRules, ruleCard, true)) {
    issues.push(
      `${character.name} does not have any level of ${ruleCard.name}`
    );
  } else if (cardIsOwned(charRules, ruleCard)) {
    issues.push(`${character.name} already has ${ruleCard.name}`);
  }

  if (!hasRequired(charRules, ruleCard)) {
    // @ts-ignore // Yes, ruleCard.requires is defined
    const requires = ruleCard.requires;
    issues.push(
      `${character.name} does not meet the requirement "${requires}"`
    );
  }

  // Check that the player has enough points

  return issues;
};

export const validateDormantTraining: ValidationAction = (
  _,
  charRules,
  ruleCard
) => {
  if (ruleCard.type !== "skill") {
    return [`${ruleCard.name} can not be trained. You can only train skills`];
  }
  const charRule = charRules.find(charRule => isSameCard(charRule, ruleCard));
  if (charRule?.dormant !== true) {
    return [`${ruleCard.name} can not be trained. It is not dormant`];
  }
  return [];
};

export type RuleCardRestrictions = {
  owned: number;
  ownsOtherLevel: boolean;
  canOwnMultiple: boolean;
  add: ValidationIssues;
  remove: ValidationIssues;
  levelChange: ValidationIssues;
  canBeTrained: ValidationIssues;
};

export const ruleCardRestrictions = (
  ...args: ValidationActionArgs
): RuleCardRestrictions => {
  return {
    owned: charCardsOwned(args[1], args[2]).length,
    ownsOtherLevel:
      cardIsOwned(args[1], args[2], true) &&
      !cardIsOwned(args[1], args[2], false),
    canOwnMultiple: canOwnMultiple(args[2]),
    add: validateCardAdd(...args),
    remove: validateCardRemove(...args),
    levelChange: validateLevelChange(...args),
    canBeTrained: validateDormantTraining(...args)
  };
};
