const adjectives = [
  "badass",
  "honourable",
  "woke",
  "wise",
  "humble",
  "stoic",
  "brave",
  "sly",
  "proud",
  "noble",
  "magnificent"
];
const quests = [
  "saving the innocent",
  "sailing the seas",
  "delving for gold",
  "sturggling to survive",
  "vanquishing their enemies",
  "raging against the machine",
  "bringing smiles to children",
  "enjoying long naps"
];

export function randomBio({ race }: { race: string }): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const quest = quests[Math.floor(Math.random() * adjectives.length)];
  return `A ${adjective} ${race}, ${quest}.`;
}
