# TODO

- Show the navbar on smaller resolutions
- Replace the Vue logo with a Heimr logo
- Offline firestore does not seem to work
- UI is a little busted on mobile
- unmount everything and clear the cache on sign-out
- Move all data into cache on sign-in. There isn't that much, and its better for offline
- Add types to the store
- Give names to all routes and use those in navbar
- Make better user of store getters
- Build out tests
- Surgery deck
- Admin features
- Figure out what to do with multiple tab offline mode
- Set required props in components and provide type saftey
- Add theming / design / logo
- Event display & creation
- Downtime system
- Lock characters after an event
- Checkout items for an event
- Alchemy mini game
- Surgery mini game
- Separate prod and dev databases

### Char creation

- Make the headings in the tablist more distinct
- Add an explainer about what "add with changes" is for
- Make it clear that your race is your character card
- Include all costs in the card group heading, instead of a range: "4, 6 or 10 points" instead of "4 - 10 points",
- In a card group, if any is owned, select it by default
- Allow someone to add character notes, and a bio in "finish". Replace it with the randomised character string.
- In the domains step, add links to the various domain rules
- Immediately save new characters instead of waiting until step 2
- When updating a char, redirect to the last uncompleted step
- Add a distinct style (such is italic or a color change) defined terms. For example "sturdy stance 1" in "tellurian"
- Add a way for people to learn about common terms such as "charm", "DC, "blessing", "medium weapon", "R", "C".
- Merge step 3 and 4, so that people can buy skills and items together.
- Put "priest" before "ceremony master", priest is the more important skill.
- Explain what dormant skills are, maybe in the guide?
- Show a "total HP" in finish, including armor and combat mobility
- Show a "total WP" considering
- Consider "loan" as part of your total coppers
- In "finish", show replacement of "..."
- Group Feyfolk race cards
- Bij xs, zet de level knoppen boven de regels ipv rechts ernaast
- Add filter textfield to races
- Adjust the divider position in the stepper
- In finish, "feyfolk destroyer" wraps when it shouldn't
- Make the tiles in My Characters wider, include a status, and info about its skills
- Prompt users when adding race / skill that gives a bonus ruleCard
- Group weapons, shields, armor, emblems
- Remove everything dependent on a required skill / condition when removing that ruleCard
- Add Loading component for Characters data

## Automata editor

- Download SVG option
- Improve layout for mobile
- Don't reload My Automata on each page load
- Share automata through a URL
- Autocomplete for particles, atoms & take
- Add example automata
- Make "duration" a integer only
- Type checking for "amount"
- Show glyph execution order
- Show errors for short curcut or multiple begins
- Compute the automata's cost
- Compute the automata's dominance
- Add a "run" button that returns the output of the last glyph
- Sort my automata by date, and add a search option to it

## Books

- Have the "next" link go into a book if it has subcontent
- Remove internal links from books

## Handle custom rules

- "You receive a free Materal Compendium item when you acquire this skill."
- "If you have XX points worth of non-dormant skills or conditions in a single domain this condition is free."
- "You have an additional Xℜ each month."
- "Retraining dormant skills costs 5ℜ per point"
- "Once per month you can reduce the cost of training a skill with 7ℜ"
- "You gain the Sturdy Stance 1 skill and it costs 2ℜ less to maintain"

## Fix Heimr stuff

- loan / loan use counters instead of levels
- Add example automata
- Figure out which conditions can be bought during char creation
- How do you get a higher salary if you don't meet the "X points in a domain" requirement
- It's unclear how in "priest 1" you should choose blessings. There is no mechanism for recording the blessings you chose. I suggest letting a priets decide at the start of an event instead.
- Rename "DC" to "charge" in divine magic. The abbreviation is confusing and unnecessary. Core rules even has a different "DC" abbreviation "directed character".
- Damaging throw: it is not clear why it does "hit 1". Maybe add that it would normally do stumble.
- Improve the readability of the domains by adding headings in between different groups of items. It might also be helpful to remove the cards all together in some cases, as all the info is already in a single table.
- Rename the "automata" chapter to "What are automata?"
- In Primordial, "spark" isn't properly introduced. It mentions "mutant", but it isn't clear what the difference is between a mutant and a mage.
- Stop using base 6. It makes an already difficult domain far more difficult, for no real benefit
- Use the metric system. The imperial system makes this domain harder then it needs to be
- "this item has special physrep requirements" -> can we just say what the requirement is on the card?
- "Imbue" increases standard of living without increasing the value of 1ℜ. Suggest taking this out. Downtime system should be optional.
