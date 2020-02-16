import { Character, CharacterRule } from "@/types";
import { getCharacterProps, CharacterProps } from "./characterProps";
import {
  getPointsSpent,
  getCoppersSpent,
  getSkillPointCount,
  getMonthlySavings
} from "./characterCardProps";

export type ComputedPointProps = {
  pointsSpent: number;
  dormantSpent: number;
  skillPointCount: number;
  monthlySavings: number;
  pointsLeft: number;
  dormantLeft: number;
  convertedPoints: number;
};

export type ComputedCoppersProps = {
  coppersSpent: number;
  coppers: number;
  coppersTotal: number;
};

export type CharacterInfo = CharacterProps &
  ComputedPointProps &
  ComputedCoppersProps;

export const getComputedPointProps = (
  charProps: Character | undefined,
  rules: CharacterRule[]
): ComputedPointProps => {
  const { startingPoints, freeDormant, pointConvertionMax } = getCharacterProps(
    charProps
  );

  const pointsSpent = getPointsSpent(rules);
  const dormantSpent = getPointsSpent(rules, true);
  const skillPointCount = getSkillPointCount(rules);
  const monthlySavings = charProps ? getMonthlySavings(charProps, rules) : 0;

  const pointsLeft = startingPoints - pointsSpent;
  const dormantLeft = freeDormant - dormantSpent;
  const convertedPoints = Math.max(Math.min(pointsLeft, pointConvertionMax), 0);

  return {
    pointsSpent,
    dormantSpent,
    skillPointCount,
    monthlySavings,
    pointsLeft,
    dormantLeft,
    convertedPoints
  };
};

export const getComputedCoppersProps = (
  charProps: Character | undefined,
  rules: CharacterRule[]
): ComputedCoppersProps => {
  const { pointsToCopperValue, startingCash } = getCharacterProps(charProps);
  const { convertedPoints } = getComputedPointProps(charProps, rules);

  const coppersSpent = getCoppersSpent(rules);

  if (typeof charProps?.coppers !== "number") {
    const coppersTotal = startingCash + convertedPoints * pointsToCopperValue;
    const coppers = coppersTotal - coppersSpent;
    return { coppersSpent, coppers, coppersTotal };
  }

  const coppers = charProps.coppers;
  const coppersTotal = coppersSpent + coppers;
  return { coppersSpent, coppers, coppersTotal };
};

export const getComputedProps = (
  charProps: Character | undefined,
  rules: CharacterRule[]
): CharacterInfo => {
  return {
    ...getComputedCoppersProps(charProps, rules),
    ...getComputedPointProps(charProps, rules),
    ...getCharacterProps(charProps)
  };
};
