import heimrData from "@/assets/heimr-data.json";
import heimrMeta from "@/assets/heimr-metadata.json";

import {
  Domain,
  RaceCard,
  RuleCard,
  CharacterRule,
  Character,
  GlyphCard,
  ComplicationCard
} from "@/types";
import {
  ruleCardRestrictions,
  RuleCardRestrictions
} from "./heimr/validateCardActions";

export { isSameCard } from "@/heimr/isSameCard";

export interface RaceMeta {
  name: string;
  plural: string;
  description: string;
  region: string;
  diety: string;
  url: string;
}

export interface DomainMeta {
  domainName: string;
  complexity: number;
  description: string;
}

export const date = heimrData.date as string;
export const races = heimrData.races as RaceCard[];
export const domains = heimrData.domains as Domain[];
export const glyphCards = heimrData.glyphs as GlyphCard[];
export const complicationCards = heimrData.complications as ComplicationCard[];

export const racesMeta = heimrMeta.races as RaceMeta[];
export const domainsMeta = heimrMeta.domains as DomainMeta[];

export const getRaceMeta = (raceCard: RaceCard): RaceMeta | undefined => {
  const raceName = raceCard.name.split(" ")[0];
  return racesMeta.find(({ name }) => name === raceName);
};

export const domainImages = [
  "alchemy",
  "defence",
  "armed-combat",
  "battlefield-surgery",
  "divine-magic",
  "primordial-magic",
  "the-marketplace"
];

/**
 * Find a rule based on a CharacterRule object (domain, name, type)
 */
export function findRuleCard({
  domainName,
  name,
  type
}: CharacterRule): RuleCard | null {
  const key = (type + "s") as "items" | "skills" | "conditions";
  const ruleDomain = domains.find(domain => domain.domainName === domainName);
  if (!ruleDomain || !Array.isArray(ruleDomain[key])) {
    return null;
  }
  const ruleCards: RuleCard[] = ruleDomain[key] || [];
  return (
    ruleCards.find((rule: RuleCard): boolean => rule.name === name) || null
  );
}

export function domainImg({ domainName }: Domain): string {
  const imgName: string = domainName.toLowerCase().replace(/\s/g, "-");
  if (domainImages.includes(imgName)) {
    return `domains/${imgName}.png`;
  }
  return "auto-repair.png";
}

export const raceImages = [
  "elf",
  "fae",
  "feyfolk-destroyer",
  "feyfolk-explorer",
  "gnome",
  "halfling",
  "human",
  "lizardman",
  "merfolk",
  "nymph",
  "ogre",
  "orc",
  "shanata",
  "slemmering",
  "tellurian",
  "troll"
];

export function raceImg(name?: string): string {
  if (typeof name !== "string") {
    return "auto-repair.png";
  }
  const imgName: string = name.toLowerCase().replace(/\s/g, "-");
  if (raceImages.includes(imgName)) {
    return `races/${imgName}.png`;
  }
  return "auto-repair.png";
}

type RuleValue = {
  unit: string;
  value: number;
};

const units = ["¢", "ℜ"];
const unitTest = `[${units.join("")}]`;
const numberTest = "[1-9][0-9]*";
const parserReg = new RegExp(`(${numberTest})(${unitTest})`);

export function parseRuleValue(str?: string): RuleValue | null {
  if (!str) {
    return null;
  }
  if (str.toLowerCase() === "free") {
    return { value: 0, unit: "¢" };
  }

  const match = str.match(parserReg);
  if (match === null || isNaN(parseInt(match[0]))) {
    return null;
  }
  return { value: +match[1], unit: match[2] };
}

export interface RuleCardGroup {
  groupName: string;
  length: number;
  ruleCards: {
    ruleCard: RuleCard;
    restrictions: RuleCardRestrictions;
  }[];
}
// Character, CharacterRule[], RuleCard[], string
export function groupCards(
  character: Character,
  charRules: CharacterRule[],
  domainName: string,
  ruleCards?: RuleCard[]
): RuleCardGroup[] {
  const groups: RuleCardGroup[] = [];
  ruleCards = ruleCards || ([] as RuleCard[]);

  ruleCards.forEach(ruleCard => {
    let groupName: string;
    if (
      (ruleCard.type === "skill" || ruleCard.type === "condition") &&
      ruleCard.category
    ) {
      groupName = ruleCard.category;
    } else {
      groupName = ruleCard.name;
    }
    const restrictions = ruleCardRestrictions(
      character,
      charRules,
      ruleCard,
      domainName
    );
    const group = groups.find(group => group.groupName === groupName);
    if (group) {
      group.ruleCards.push({ ruleCard, restrictions });
      group.length++;
    } else {
      groups.push({
        groupName,
        length: 1,
        ruleCards: [{ ruleCard, restrictions }]
      });
    }
  });

  return groups;
}
