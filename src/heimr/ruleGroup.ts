import { parseRuleValue, RuleCardGroup } from "@/heimr-data";

export function ruleGroupCostText(ruleCardGroup: RuleCardGroup): string {
  if (ruleCardGroup.ruleCards.length === 1) {
    const { ruleCard } = ruleCardGroup.ruleCards[0];
    if (ruleCard.type === "item" || ruleCard.type === "consumable") {
      return (ruleCard.marketPrice || "").toLocaleLowerCase();
    } else {
      return ruleCard.points ? `${ruleCard.points} points` : "";
    }
  }

  let min: number = 0;
  let max: number = 0;
  let unit: string = "";
  ruleCardGroup.ruleCards.forEach(({ ruleCard }) => {
    let value: number = min;
    const { marketPrice, points } = ruleCard as {
      marketPrice?: string;
      points?: number;
    };
    if (marketPrice && points) {
      throw new Error("Can not have card with both marketPrice and points");
    }
    if (typeof points === "number") {
      value = points;
    } else {
      const parsed = parseRuleValue(marketPrice) || { unit: "", value: 0 };
      unit = parsed.unit || unit;
      value = parsed.value || min;
    }

    min = !min ? value : Math.min(value, min);
    max = Math.max(value, max);
  });

  if (max === 0) {
    return "";
  }
  let tail = "";
  if (!unit) {
    tail = " point" + (max > 1 ? "s" : "");
  }
  if (min === max) {
    return `${max}${unit}${tail}`;
  }
  return `${min}${unit} - ${max}${unit}${tail}`;
}

export function ruleGroupLevelText(ruleCardGroup: RuleCardGroup): string {
  const length: number = ruleCardGroup.length;
  if (length === 1) {
    return ruleCardGroup.groupName;
  }
  if (length === 2) {
    return `${ruleCardGroup.groupName}, level 1 & 2`;
  }
  return `${ruleCardGroup.groupName}, level 1 - ${length}`;
}
