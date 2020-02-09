const adjectives = ["badass", "honourable", "woke", "wise", "humble"];
const quests = [
  "saving the innocent",
  "sailing the seas",
  "delving for gold",
  "sturggling to survive",
  "vanquishing their enemies"
];

export function randomBio({ race }: { race: string }): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const quest = quests[Math.floor(Math.random() * adjectives.length)];
  return `A ${adjective} ${race}, ${quest}.`;
}
