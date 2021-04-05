# TODO

- Migrate to web.app domain
- Make char notes truly private
- Ensure applying downtime period can only happen on an up-to-date char
- Bug: Monthly savings is not reporting right (see Orc)
- Move all data into cache on sign-in. There isn't that much, and its better for offline
- Use router meta.title prop
- For mobile, put the h1 in the header, replacing the Heimr logo
- Restore sign-out option
- In char creation mobile, add hamburger in top right for step navigation
- Animate page transitions
- Swipe left - right to navigate in books
- unmount everything and clear the cache on sign-out
- Add types to the store
- Give names to all routes and use those in navbar
- Make better user of store getters
- Build out tests
- Admin features
- Figure out what to do with multiple tab offline mode
- Set required props in components and provide type saftey
- Add theming / design / logo
- Event display & creation
- Downtime system
- Lock characters after an event
- Checkout items for an event
- Alchemy mini game
- Separate prod and dev databases

### Downtime

- Sell items
- Train skills
- Change skill level
- Retrain dormant skills
- Group rule cards
- Restore items
- Buy multiple items at once
- Autocomple "other" using downtime rules
- Continued training (required activity)
- Allow training of conditions
- Always list recovering wound

### Char creation

- Make the headings in the tablist more distinct
- Make it clear that your race is your character card
- In a card group, if any is owned, select it by default
- Don't allow swiping between domains
- Include all costs in the card group heading, instead of a range: "4, 6 or 10 points" instead of "4 - 10 points",
- Explain what dormant skills are, maybe in the guide?
- In the domains step, add links to the various domain rules
- Immediately save new characters instead of waiting until step 2
- Add a distinct style (such is italic or a color change) defined terms. For example "sturdy stance 1" in "tellurian"
- Add a way for people to learn about common terms such as "charm", "DC, "blessing", "medium weapon", "R", "C".
- Merge step 3 and 4, so that people can buy skills and items together.
- Put "priest" before "ceremony master", priest is the more important skill.
- Show a "total HP" in finish, including armor and combat mobility
- Show a "total WP" considering
- Consider "loan" as part of your total coppers
- Group Feyfolk race cards
- Add filter textfield to races
- Adjust the divider position in the stepper
- In finish, "feyfolk destroyer" wraps when it shouldn't
- Prompt users when adding race / skill that gives a bonus ruleCard
- Group weapons, shields, armor, emblems
- Remove everything dependent on a required skill / condition when removing that ruleCard
- Add Loading component for Characters data

## Automata editor

- Download SVG option
- Improve layout for mobile
- Don't reload My Automata on each page load
- Share automata through a URL
- Use https://roughjs.com/ for a hand-drawn look
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
