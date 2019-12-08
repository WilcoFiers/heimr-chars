import { parseRuleValue } from "@/heimr-data";
import { RuleCard } from "@/types";

export interface CustomField {
  required?: boolean;
  preset?: string | number | boolean;
}

export interface CustomCardData {
  nameDetail?: CustomField & { preset?: string };
  points?: CustomField & { preset?: number };
  upkeep?: CustomField & { preset: number };
  dormant?: CustomField & { preset: boolean };
  cashPaid?: CustomField & { preset?: number };
  counters?: CustomField & { preset: number };
}

export const dataDefault: CustomCardData = Object.freeze({
  nameDetail: undefined,
  points: undefined,
  upkeep: undefined,
  dormant: undefined,
  cashPaid: undefined,
  counters: undefined
});

export function getFormData(ruleCard: RuleCard): CustomCardData {
  const data: CustomCardData = { ...dataDefault };
  if (ruleCard.name.includes("...")) {
    data.nameDetail = {
      required: true
    };
  }
  if (ruleCard.type === "skill") {
    data.points = {
      required: true,
      preset: ruleCard.points
    };
    data.upkeep = {
      required: true,
      preset: ruleCard.points
    };
    data.dormant = {
      required: true,
      preset: false
    };
  } else if (ruleCard.type === "condition") {
    data.points = {
      required: false,
      preset: ruleCard.points
    };
  } else {
    const { value = undefined } = parseRuleValue(ruleCard.marketPrice) || {};
    data.cashPaid = {
      required: true,
      preset: value
    };
  }
  if (canHaveCounters(ruleCard)) {
    data.counters = {
      required: true,
      preset: 0
    };
  }
  return data;
}

export function canHaveCounters(ruleCard: RuleCard): boolean {
  const rules: string[] = [];
  if (Array.isArray(ruleCard.uniqueRules)) {
    rules.push(...ruleCard.uniqueRules);
  }
  if (Array.isArray(ruleCard.sharedRules)) {
    rules.push(...ruleCard.sharedRules);
  }
  return rules.some(rule => rule.includes("counter"));
}
