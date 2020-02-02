import { RuleObject } from "./toCardObject";
import { ComplicationCard } from "../src/types";

const replaceRegex = /At level ([1-3]) these cards are replaced by "(.*)"/i;

export function toComplication(ruleObj: RuleObject): ComplicationCard | null {
  const { name: nameArr, type: typeArr, meta } = ruleObj;
  if (!nameArr || typeArr.length !== 1 || typeArr[0] !== "complication") {
    return null;
  }

  const pecentage = meta[0].match(/([0-9]*)%/);
  if (!pecentage) {
    throw new Error(`Can not get percentage from ${nameArr[0]}`);
  }

  const replaceRule = meta[0].match(replaceRegex);
  let replace: Partial<ComplicationCard> = {};
  if (replaceRule && replaceRule.length === 3) {
    replace.replaceLevel = parseInt(replaceRule[1]);
    replace.replaceCard = replaceRule[2];
  }

  return {
    type: "complication",
    name: nameArr[0],
    uniqueRules: ruleObj["unique rule"],
    drawChance: parseInt(pecentage?.[1] || "0"),
    ...replace
  };
}
