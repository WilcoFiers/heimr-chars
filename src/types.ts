// Heimr stuff
export type BaseRule = {
  type: string;
  name: string;
  details?: string;
  uniqueRules?: string[];
  sharedRules?: string[];
  downtimeRules?: string[];
};

export type Item = BaseRule & {
  type: "item";
  marketPrice?: string;
  restorePrice?: string;
  toughness?: number;
  physrep?: string;
};

export type Condition = BaseRule & {
  type: "condition";
  points?: number;
};

export type Skill = BaseRule & {
  type: "skill";
  points: number;
  requires?: string;
  upgrade?: string;
};

export type Race = BaseRule & {
  type: "race";
  hitpoints: number;
  willpower: number;
};

export type Domain = {
  domainName: string;
  items?: Item[];
  skills?: Skill[];
  conditions?: Condition[];
};

export type Races = {
  races: Race[];
};

export type RuleType = "item" | "skill" | "condition";
export type CardType = "race" | RuleType;
export type Rule = Skill | Condition | Item;

// App stuff
export type Character = {
  name: string;
  race: string;
  playerID: string;
  archive: boolean;
};

export interface CharacterDoc extends firebase.firestore.DocumentReference {
  set(
    data: Partial<Character>,
    options?: firebase.firestore.SetOptions
  ): Promise<void>;
}

export interface CharacterCol extends firebase.firestore.CollectionReference {
  add(data: Character): Promise<firebase.firestore.DocumentReference>;
  doc(documentPath?: string): CharacterDoc;
}

export type CharacterRule = {
  name: string;
  domainName: string;
  type: RuleType;
};

export interface CharacterRuleDoc extends firebase.firestore.DocumentReference {
  set(
    data: Partial<CharacterRule>,
    options?: firebase.firestore.SetOptions
  ): Promise<void>;
}

export interface CharacterRuleCol
  extends firebase.firestore.CollectionReference {
  add(data: CharacterRule): Promise<firebase.firestore.DocumentReference>;
  doc(documentPath?: string): CharacterRuleDoc;
}
