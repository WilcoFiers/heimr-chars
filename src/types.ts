export { State } from "@/store";
import { firestore } from "firebase";
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
  coppers?: number;
  lastUpdated?: any;
  isComplete?: boolean;
  shortBio?: string;
  fullBio?: string;

  // TODO: Sort these out, they're not actually in DB:
  startingPoints?: number;
  startingCash?: number;
  monthlyResources?: number;
  costOfLiving?: number;
  resourceToCash?: number;
};

export type Character = NewCharacter & DbEntry;

export interface CharacterDoc extends firestore.DocumentReference {
  set(data: Partial<Character>, options?: firestore.SetOptions): Promise<void>;
}

export interface CharacterCol extends firestore.CollectionReference {
  add(data: NewCharacter): Promise<firestore.DocumentReference>;
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

export interface CharacterRuleDoc extends firestore.DocumentReference {
  set(
    data: Partial<CharacterRule>,
    options?: firestore.SetOptions
  ): Promise<void>;
}

export interface CharacterRuleCol extends firestore.CollectionReference {
  add(data: NewCharacterRule): Promise<firestore.DocumentReference>;
  doc(documentPath?: string): CharacterRuleDoc;
}

export type BaseDowntimeItem = {
  title: string;
  cost: number;
  subTitle: undefined;
};

export type DowntimeItem =
  | BaseDowntimeItem
  | {
      title: string;
      subTitle: string;
      cost: number;
      action: string;
      id: string;
      domainName: string;
      type: string;
    };

export interface NewDowntimePeriod {
  duration: number;
  costOfLiving: number;
  resourceValue: number;
  coppersAtStart: number;
  monthlyResources: number;
  skillUpkeepAtStart: number;
  actions: DowntimeItem[];
  exchanges: DowntimeItem[];
  complete: boolean;
}

export type DowntimeComputed = NewDowntimePeriod & {
  resourcesTotal: number;
  costOfLivingTotal: number;
  skillPointCountTotal: number;
  unspentResources: number;
  dayjobIncome: number;
  cashAfter: number;
};

export type DowntimePeriod = NewDowntimePeriod & DbEntry;

export type HeimrBook = {
  sectionName: string;
  sectionPath: string;
  html: string;
  subsections: string[];
};

export type GlyphCard = {
  type: "glyph";
  name: string;
  pick: string[];
  input?: string;
  output?: string[];
  cost: string;
  comment: string[];
  dominant?: string;
};

export type ComplicationCard = {
  type: "complication";
  name: string;
  uniqueRules: string[];
  drawChance: number;
  replaceLevel?: number;
  replaceCard?: string;
};

export type NewAutomata = {
  title: string;
  playerID: string;
  width: number;
  height: number;
  createdAt?: any;
  lastUpdated?: any;
};

export type Automata = NewAutomata & DbEntry;

export interface AutomataDoc extends firestore.DocumentReference {
  set(data: Partial<Automata>, options?: firestore.SetOptions): Promise<void>;
}

export interface AutomataCol extends firestore.CollectionReference {
  add(data: NewAutomata): Promise<firestore.DocumentReference>;
  doc(documentPath?: string): AutomataDoc;
}

export type NewGlyphCell = {
  glyph: string;
  pick1?: string;
  pick2?: string;
};

export type GlyphCell = NewGlyphCell & DbEntry;

export interface GlyphCellDoc extends firestore.DocumentReference {
  set(data: Partial<GlyphCell>, options?: firestore.SetOptions): Promise<void>;
}

export interface GlyphCellCol extends firestore.CollectionReference {
  add(data: NewGlyphCell): Promise<firestore.DocumentReference>;
  doc(documentPath?: string): GlyphCellDoc;
}
