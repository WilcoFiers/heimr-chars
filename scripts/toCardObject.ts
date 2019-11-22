import {
  RaceCard,
  ItemCard,
  ConsumableCard,
  SkillCard,
  ConditionCard,
  Level,
  BaseRuleCard
} from "../src/types";

export type RuleObject = {
  [propName: string]: string[];
};

const baseProps = [
  "name",
  "type",
  "details",
  "unique rule",
  "shared rule",
  "downtime rule",
  "rule"
];

export function toBaseRule(ruleObj: RuleObject): BaseRuleCard | null {
  const { name: nameArr, type: typeArr } = ruleObj;
  if (!nameArr || !typeArr) {
    return null;
  }
  const name = nameArr[0];
  const type = typeArr[0];
  const baseRule: BaseRuleCard = { type, name };

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
  if (ruleObj.rule) {
    baseRule.uniqueRules = (baseRule.uniqueRules || []).concat(ruleObj.rule);
  }
  return baseRule;
}

function toLevel(name: string): Level {
  const levelTest = /^(.+)\s([0-9])$/;
  const match = name.match(levelTest);
  if (match) {
    const category = match[1];
    const level = parseInt(match[2]);
    if (isNaN(level) === false) {
      return { category, level };
    }
  }
  return {};
}

const conditionProps = ["condition", "requires", "points"];
export function toCondition(ruleObj: RuleObject): ConditionCard | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "condition") {
    return null;
  }
  logUnknowns(ruleObj, conditionProps);

  const condition: ConditionCard = {
    ...base,
    type: "condition",
    ...toLevel(base.name)
  };
  if (ruleObj.points) {
    condition.points = +ruleObj.points[0];
  }
  if (ruleObj.requires) {
    condition.requires = ruleObj.requires[0];
  }
  return condition;
}

const raceProps = ["race", "hp", "wp"];

export function toRace(ruleObj: RuleObject): RaceCard | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "race") {
    return null;
  }
  logUnknowns(ruleObj, raceProps);

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

const itemProps = [
  "item",
  "market price",
  "restore price",
  "toughness",
  "physrep",
  "large"
];

export function toItem(ruleObj: RuleObject): ItemCard | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "item") {
    return null;
  }
  logUnknowns(ruleObj, itemProps);

  const item: ItemCard = {
    ...base,
    type: "item",
    large: !!ruleObj.large
  };
  if (ruleObj["market price"]) {
    item.marketPrice = ruleObj["market price"][0];
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

const consumableProps = ["consumable", "market price"];

export function toConsumable(ruleObj: RuleObject): ConsumableCard | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "consumable") {
    return null;
  }
  logUnknowns(ruleObj, consumableProps);

  const consumable: ConsumableCard = {
    ...base,
    type: "consumable"
  };
  if (ruleObj["market price"]) {
    consumable.marketPrice = ruleObj["market price"][0];
  }
  return consumable;
}

const skillProps = ["skill", "points", "point", "requires", "level", "wp"];

export function toSkill(ruleObj: RuleObject): SkillCard | null {
  const base = toBaseRule(ruleObj);
  if (!base || base.type !== "skill") {
    return null;
  }
  logUnknowns(ruleObj, skillProps);

  const points = parseInt(ruleObj.points && ruleObj.points[0]);
  const point = parseInt(ruleObj.point && ruleObj.point[0]);
  if (isNaN(points) && isNaN(point)) {
    console.log(`skill '${ruleObj.name}' has no points`);
    return null;
  }

  const skill: SkillCard = {
    ...base,
    type: "skill",
    points: points || point,
    ...toLevel(base.name)
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

function logUnknowns(ruleObj: RuleObject, props: string[]) {
  props = props.concat(baseProps);
  Object.keys(ruleObj).forEach(key => {
    if (!props.includes(key)) {
      console.log(`Unknown key '${key}' in ${ruleObj.type} '${ruleObj.name}'`);
    }
  });
}
