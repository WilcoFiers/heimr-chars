import { CharacterInfo } from "./computedProps";

type ErrorMessages = string[];

export function validatePoints({
  pointConvertionMax,
  pointsLeft,
  freeDormant,
  pointsSpent,
  dormantSpent,
  startingPoints
}: CharacterInfo): ErrorMessages {
  const issues = [];
  if (pointsLeft < 0) {
    issues.push(
      `You can not spend more than ${startingPoints} points. You spent ${pointsSpent}.`
    );
  } else if (pointsLeft > pointConvertionMax) {
    const minimumPoints = startingPoints - pointConvertionMax;
    issues.push(
      `You must spend at least ${minimumPoints} points. You spent ${pointsSpent} points so far.`
    );
  }

  if (dormantSpent > freeDormant) {
    if (freeDormant === 0) {
      issues.push(
        `You can not spend points on dormant skills. You spent ${dormantSpent}.`
      );
    } else {
      issues.push(
        `You can not spend more than ${freeDormant} points on dormant skills. You spent ${dormantSpent}.`
      );
    }
  }

  return issues;
}

export function validateCoppers({
  coppersTotal,
  coppersSpent
}: CharacterInfo): ErrorMessages {
  if (coppersSpent > coppersTotal) {
    return [
      `You can not spend more than ${coppersTotal} copper. You have spent ${coppersSpent}.`
    ];
  }
  return [];
}
