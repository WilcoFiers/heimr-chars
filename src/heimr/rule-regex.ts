import { RuleCard, RaceCard } from "@/types";

export function cardMatchesRule(
  ruleCard: RuleCard | RaceCard,
  match: RegExp | RegExp[]
): boolean | string {
  const matches: RegExp[] = Array.isArray(match) ? match : [match];
  const rules: string[] = [];

  if (Array.isArray(ruleCard.uniqueRules)) {
    rules.push(...ruleCard.uniqueRules);
  }
  if (Array.isArray(ruleCard.downtimeRules)) {
    rules.push(...ruleCard.downtimeRules);
  }
  if (Array.isArray(ruleCard.sharedRules)) {
    rules.push(...ruleCard.sharedRules);
  }
  for (const rule of rules) {
    for (const regex of matches) {
      regex.lastIndex = 0; // Reset regex, prevent a gnarly bug
      const out = regex.exec(rule);
      if (out) {
        return out.groups && out.groups.value ? out.groups.value : true;
      }
    }
  }
  return false;
}

// Stuff that tests if a skill or condition can be owned multiple times
export const multiCardRuleMatches = [
  /you can (gain|have|buy) this (skill|condition) (multiple times|more than once)/gi,
  /you can have multiple of these (skills|conditions)/gi
];

export const freeDormantSkills = [
  /In character creation, spend (?<value>[1-9][0-9]?) extra points on dormant skills/gi
];
