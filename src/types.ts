export { State } from "@/store";

export { CharacterInfo } from "@/heimr/computedProps";

// Heimr stuff
export type BaseRuleCard = {
  type: string;
  name: string;
  details?: string;
  uniqueRules?: string[];
  sharedRules?: string[];
  downtimeRules?: string[];
};

export type Level = {
  category?: string;
  level?: number;
};

export type ItemCard = BaseRuleCard & {
  type: "item";
  marketPrice?: string;
  restorePrice?: string;
  toughness?: number;
  physrep?: string;
  large: boolean;
};

export type ConsumableCard = BaseRuleCard & {
  type: "consumable";
  marketPrice?: string;
};

export type ConditionCard = BaseRuleCard &
  Level & {
    type: "condition";
    points?: number;
    requires?: string;
  };

export type SkillCard = BaseRuleCard &
  Level & {
    type: "skill";
    points: number;
    requires?: string;
    upgrade?: string;
  };

export type RaceCard = BaseRuleCard & {
  type: "race";
  hitpoints: number;
  willpower: number;
};

export type Domain = {
  domainName: string;
  items?: ItemCard[];
  consumables?: ConsumableCard[];
  skills?: SkillCard[];
  conditions?: ConditionCard[];
};

export type RaceCards = {
  races: RaceCard[];
};

export type RuleType = "item" | "skill" | "condition" | "consumable";
export type CardType = "race" | RuleType;
export type RuleCard = SkillCard | ConditionCard | ItemCard | ConsumableCard;

// App stuff
export type DbEntry = {
  id: string;
};

export type NewCharacter = {
  name: string;
  race: string;
  playerID: string;
  archive: boolean;
  createdAt?: any;
  lastUpdated?: any;
  startingPoints?: number;
  startingCash?: number;
  monthlyResources?: number;
  costOfLiving?: number;
  resourceToCash?: number;
};

export type Character = NewCharacter & DbEntry;

export interface CharacterDoc extends firebase.firestore.DocumentReference {
  set(
    data: Partial<Character>,
    options?: firebase.firestore.SetOptions
  ): Promise<void>;
}

export interface CharacterCol extends firebase.firestore.CollectionReference {
  add(data: NewCharacter): Promise<firebase.firestore.DocumentReference>;
  doc(documentPath?: string): CharacterDoc;
}

export type NewCharacterRule = {
  name: string;
  domainName: string;
  type: RuleType;
  nameDetail?: string;
  cashPaid?: number;
  points?: number;
  upkeep?: number;
  dormant?: boolean;
  counters?: number;
};

export type CharacterRule = NewCharacterRule & DbEntry;

export interface CharacterRuleDoc extends firebase.firestore.DocumentReference {
  set(
    data: Partial<CharacterRule>,
    options?: firebase.firestore.SetOptions
  ): Promise<void>;
}

export interface CharacterRuleCol
  extends firebase.firestore.CollectionReference {
  add(data: NewCharacterRule): Promise<firebase.firestore.DocumentReference>;
  doc(documentPath?: string): CharacterRuleDoc;
}

export type HeimrBook = {
  sectionName: string;
  sectionPath: string;
  html: string;
  subsections: string[];
};
