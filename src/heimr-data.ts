import heimrData from "@/assets/heimr-data.json";
import { Domain, Race, Rule, CharacterRule } from "@/types";

export const date = heimrData.date as string;
export const races = heimrData.races as Race[];
export const domains = heimrData.domains as Domain[];

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
export function findRule({
  domainName,
  name,
  type
}: CharacterRule): Rule | null {
  const key = (type + "s") as "items" | "skills" | "conditions";
  const ruleDomain = domains.find(domain => domain.domainName === domainName);
  if (!ruleDomain || !Array.isArray(ruleDomain[key])) {
    return null;
  }
  const rules: Rule[] = ruleDomain[key] || [];
  return rules.find((rule: Rule): boolean => rule.name === name) || null;
}

export function domainImg({ domainName }: Domain): string {
  const imgName: string = domainName.toLowerCase().replace(/\s/g, "-");
  if (domainImages.includes(imgName)) {
    return require(`./assets/domains/${imgName}.png`);
  }
  return require("./assets/auto-repair.png");
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
    return require("./assets/auto-repair.png");
  }
  const imgName: string = name.toLowerCase().replace(/\s/g, "-");
  if (raceImages.includes(imgName)) {
    return require(`./assets/races/${imgName}.png`);
  }
  return require("./assets/auto-repair.png");
}
