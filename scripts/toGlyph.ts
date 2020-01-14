import { RuleObject } from "./toCardObject";
import { Glyph } from "../src/types";

export function toGlyph(ruleObj: RuleObject): Glyph | null {
  const { name: nameArr, type: typeArr } = ruleObj;
  if (!nameArr || typeArr.length !== 1 || typeArr[0] !== "glyph") {
    return null;
  }
  return {
    type: "glyph",
    name: nameArr[0],
    pick: ruleObj.pick || [],
    input: ruleObj.input?.[0],
    output: ruleObj.output,
    cost: ruleObj.cost[0],
    comment: ruleObj.comment || [],
    dominant: ruleObj.dominant?.[0]
  };
}
