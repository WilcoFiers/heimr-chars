import { Race, Item, Skill, Condition, BaseRule } from "../src/types";

export type RuleObject = {
  [propName: string]: string[];
};

export function toBaseRule(ruleObj: RuleObject): BaseRule | null {
  const { name: nameArr, type: typeArr } = ruleObj;
  if (!nameArr || !typeArr) {
    return null;
  }
  const name = nameArr[0];
  const type = typeArr[0];
  const baseRule: BaseRule = { type, name };

  if (ruleObj.details) {
    baseRule.details = ruleObj.details.join("\n");
  }

  if (ruleObj["unique rule"]) {
    baseRule.uniqueRules = ruleObj["unique rule"];
  }
  if (ruleObj["shared rule"]) {
    baseRule.sharedRules = ruleObj["shared rule"];
  }
  if (ruleObj["downtime rule"]) {
    baseRule.downtimeRules = ruleObj["downtime rule"];
  }
  return baseRule;
}

export function toCondition(ruleObj: RuleObject): Condition | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "condition") {
    return null;
  }
  const condition: Condition = {
    ...base,
    type: "condition"
  };
  if (ruleObj.points) {
    condition.points = +ruleObj.points[0];
  }
  return condition;
}

export function toRace(ruleObj: RuleObject): Race | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "race") {
    return null;
  }
  const { hp, wp } = ruleObj;
  if (!hp || !wp || hp.length > 1 || wp.length > 1) {
    return null;
  }

  return {
    ...base,
    type: "race",
    hitpoints: +hp[0],
    willpower: +wp[0]
  };
}

export function toItem(ruleObj: RuleObject): Item | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "item") {
    return null;
  }
  const item: Item = {
    ...base,
    type: "item"
  };
  if (ruleObj["market price"]) {
    item.marketPrice = ruleObj["market price"][0];
  } else if (ruleObj["cost"]) {
    item.marketPrice = ruleObj["cost"][0];
  }

  if (ruleObj["restore price"]) {
    item.restorePrice = ruleObj["restore price"][0];
  }

  if (ruleObj["toughness"]) {
    item.toughness = +ruleObj["toughness"][0];
  }

  if (ruleObj["physrep"]) {
    item.physrep = ruleObj["physrep"][0];
  }
  return item;
}

export function toSkill(ruleObj: RuleObject): Skill | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "skill") {
    return null;
  }
  const { points } = ruleObj;
  if (!points) {
    return null;
  }

  const skill: Skill = {
    ...base,
    type: "skill",
    points: +points[0]
  };
  const { requires, level } = ruleObj;
  if (Array.isArray(requires)) {
    skill.requires = requires[0];
  }

  if (Array.isArray(level)) {
    skill.upgrade = level[0];
  }

  return skill;
}
