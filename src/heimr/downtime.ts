import {
  NewDowntimePeriod,
  CharacterInfo,
  DowntimeComputed,
  NewCharacter,
  CharacterRule
} from "@/types";
import { findRuleCard } from "@/heimr-data";

export const getDowntimeDefault = (
  charInfo?: CharacterInfo
): NewDowntimePeriod => {
  return {
    duration: 1,
    costOfLiving: charInfo?.costOfLiving || 400,
    resourceValue: charInfo?.resourceToCash || 4,
    actions: [],
    exchanges: [],
    coppersAtStart: charInfo?.coppers || 0,
    skillUpkeepAtStart: charInfo?.skillPointCount || 20,
    monthlyResources: charInfo?.monthlyResources || 120,
    complete: false
  };
};

export const getResourcesTotal = (
  downtimePeriod: NewDowntimePeriod
): number => {
  return downtimePeriod.monthlyResources * downtimePeriod.duration;
};

export const getCostOfLivingTotal = (
  downtimePeriod: NewDowntimePeriod
): number => {
  return downtimePeriod.costOfLiving * downtimePeriod.duration;
};

export const getSkillPointCountTotal = (
  downtimePeriod: NewDowntimePeriod
): number => {
  let dormantSavings: number = 0;
  downtimePeriod.actions.forEach(actionItem => {
    if (
      !actionItem.subTitle ||
      actionItem.type !== "skill" ||
      actionItem.action !== "remove"
    ) {
      return;
    }
    const { subTitle, id, domainName, type } = actionItem;
    const ruleCard = findRuleCard({ name: subTitle, id, domainName, type });
    // Count up how many points are saved through making a skill dormant
    if (ruleCard && ruleCard.type === type) {
      dormantSavings += ruleCard.points;
    }
  });

  return (
    (downtimePeriod.skillUpkeepAtStart - dormantSavings) *
    downtimePeriod.duration
  );
};

export const getUnspentResources = (
  downtimePeriod: NewDowntimePeriod
): number => {
  let resources = getResourcesTotal(downtimePeriod);
  resources -= getSkillPointCountTotal(downtimePeriod);

  downtimePeriod.actions.forEach(({ cost }) => {
    resources -= cost;
  });
  return resources;
};

export const getDayjobIncome = (downtimePeriod: NewDowntimePeriod): number => {
  return getUnspentResources(downtimePeriod) * downtimePeriod.resourceValue;
};

export const getCashAfter = (downtimePeriod: NewDowntimePeriod): number => {
  let cash = downtimePeriod.coppersAtStart;
  cash += getDayjobIncome(downtimePeriod);
  cash -= getCostOfLivingTotal(downtimePeriod);

  downtimePeriod.exchanges.forEach(({ cost }) => {
    cash += cost;
  });
  return cash;
};

export const getDowntimeComputed = (
  downtimePeriod: NewDowntimePeriod
): DowntimeComputed => {
  return {
    resourcesTotal: getResourcesTotal(downtimePeriod),
    costOfLivingTotal: getCostOfLivingTotal(downtimePeriod),
    skillPointCountTotal: getSkillPointCountTotal(downtimePeriod),
    unspentResources: getUnspentResources(downtimePeriod),
    dayjobIncome: getDayjobIncome(downtimePeriod),
    cashAfter: getCashAfter(downtimePeriod),
    ...downtimePeriod
  };
};

export const getCharacterMutations = (
  downtimeComputed: DowntimeComputed
): Partial<NewCharacter> => {
  return { coppers: downtimeComputed.cashAfter };
};

export const getCharacterRuleMutations = (
  downtimeComputed: DowntimeComputed
): Partial<CharacterRule>[] => {
  const ruleMutations: Partial<CharacterRule>[] = [];
  downtimeComputed.actions.forEach(actionItem => {
    if (!actionItem.subTitle) {
      return;
    }
    // Make a skill dormant
    if (actionItem.type === "skill" && actionItem.action === "remove") {
      ruleMutations.push({
        id: actionItem.id,
        dormant: true
      });
    }
  });
  return ruleMutations;
};
