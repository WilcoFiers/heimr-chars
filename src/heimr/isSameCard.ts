import { RuleCard, CharacterRule } from "@/types";

const levelTest = /^(.+)\s([0-9])$/;

export function isSameCard(
  characterRule: CharacterRule,
  ruleCard: RuleCard,
  anyLevel?: boolean
): boolean {
  const match =
    characterRule.type === ruleCard.type &&
    characterRule.name === ruleCard.name;
  if (
    !match &&
    anyLevel &&
    (ruleCard.type === "skill" || ruleCard.type === "condition")
  ) {
    const match = characterRule.name.match(levelTest);
    if (match) {
      return match[1].toLowerCase() === (ruleCard.category || "").toLowerCase();
    }
  }
  return match;
}
