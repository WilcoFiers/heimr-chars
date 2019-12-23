import { Character, RaceCard } from "@/types";
import { races } from "@/heimr-data";
import { cardMatchesRule, freeDormantSkills } from "./rule-regex";

export interface CharacterProps {
  startingPoints: number;
  startingCash: number;
  monthlyResources: number;
  costOfLiving: number;
  resourceToCash: number;
  freeDormant: number;
  pointConvertionMax: number;
  pointsToCopperValue: number;
}

export const rulesetDefaults: CharacterProps = {
  startingPoints: 20,
  startingCash: 500,
  monthlyResources: 120,
  costOfLiving: 400,
  resourceToCash: 4,
  pointConvertionMax: 5,
  pointsToCopperValue: 100,
  freeDormant: 0 // Rename to "startingDormant"
};

// @TODO: DRY these methods

export const getStartingPoints = (character?: Character): number => {
  if (character?.startingPoints === undefined) {
    return rulesetDefaults.startingPoints;
  }
  return character.startingPoints;
};

export const getStartingCash = (character?: Character): number => {
  if (character?.startingCash === undefined) {
    return rulesetDefaults.startingCash;
  }
  return character.startingCash;
};

export const getMonthlyResources = (character?: Character): number => {
  if (character?.monthlyResources === undefined) {
    return rulesetDefaults.monthlyResources;
  }
  return character.monthlyResources;
};

export const getCostOfLiving = (character?: Character): number => {
  if (character?.costOfLiving === undefined) {
    return rulesetDefaults.costOfLiving;
  }
  return character.costOfLiving;
};

export const getResourceToCash = (character?: Character): number => {
  if (character?.resourceToCash === undefined) {
    return rulesetDefaults.resourceToCash;
  }
  return character.resourceToCash;
};

export const getRaceCard = (character: Character): RaceCard | undefined => {
  return races.find(({ name }) => name === character.race);
};

export const getFreeDormant = (character?: Character): number => {
  const raceCard = character && getRaceCard(character);
  if (!raceCard) {
    return 0;
  }
  const freeDormantPoints = cardMatchesRule(raceCard, freeDormantSkills);
  if (typeof freeDormantPoints !== "string") {
    return 0;
  }
  const int = parseInt(freeDormantPoints);
  return isNaN(int) ? 0 : int;
};

export const getCharacterProps = (character?: Character): CharacterProps => {
  return {
    startingCash: getStartingCash(character),
    startingPoints: getStartingPoints(character),
    monthlyResources: getMonthlyResources(character),
    costOfLiving: getCostOfLiving(character),
    resourceToCash: getResourceToCash(character),
    freeDormant: getFreeDormant(character),
    pointConvertionMax: rulesetDefaults.pointConvertionMax,
    pointsToCopperValue: rulesetDefaults.pointsToCopperValue
  };
};
