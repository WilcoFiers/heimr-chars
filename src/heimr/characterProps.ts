import { Character } from "@/types";

interface CharacterProps {
  startingPoints: number;
  startingCash: number;
  monthlyResources: number;
  costOfLiving: number;
  resourceToCash: number;
  freeDormant: number;
}

export const rulesetDefaults: CharacterProps = {
  startingPoints: 20,
  startingCash: 500,
  monthlyResources: 120,
  costOfLiving: 400,
  resourceToCash: 4,
  freeDormant: 0
};

export const getStartingPoints = (character: Character): number => {
  if (character.startingPoints === undefined) {
    return rulesetDefaults.startingPoints;
  }
  return character.startingPoints;
};

export const getStartingCash = (character: Character): number => {
  if (character.startingCash === undefined) {
    return rulesetDefaults.startingCash;
  }
  return character.startingCash;
};

export const getMonthlyResources = (character: Character): number => {
  if (character.monthlyResources === undefined) {
    return rulesetDefaults.monthlyResources;
  }
  return character.monthlyResources;
};

export const getCostOfLiving = (character: Character): number => {
  if (character.costOfLiving === undefined) {
    return rulesetDefaults.costOfLiving;
  }
  return character.costOfLiving;
};

export const getResourceToCash = (character: Character): number => {
  if (character.resourceToCash === undefined) {
    return rulesetDefaults.resourceToCash;
  }
  return character.resourceToCash;
};

export const getFreeDormant = (character: Character): number => {
  if (character.resourceToCash === undefined) {
    return rulesetDefaults.resourceToCash;
  }
  return character.resourceToCash;
};

export const getCharacterProps = (character: Character): CharacterProps => {
  return {
    startingCash: getStartingCash(character),
    startingPoints: getStartingPoints(character),
    monthlyResources: getMonthlyResources(character),
    costOfLiving: getCostOfLiving(character),
    resourceToCash: getResourceToCash(character),
    freeDormant: getFreeDormant(character)
  };
};
