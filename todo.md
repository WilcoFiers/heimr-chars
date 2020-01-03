# TODO

- Set up Github, including deploy action
- Enable offline mode
- Build out tests
- Surgery deck
- Admin features
- Set required props in components and provide type saftey
- unmount everything on sign-out
- Add theming / design / logo
- Event display & creation
- Downtime system
- Lock characters after an event
- Checkout items for an event
- Set up as a web app (add a manifest + service worker)
- Alchemy mini game
- Surgery mini game
- Primordial magic simulator
- Separate prod and dev databases
- Handle login from view, instead of through redirects / render before autoSignin
- Remove internal links from books

### Char creation

- Bug: "points" validation does not look at custom values
- Bug: Too many dormant skills does not cause a visible error
- Improve the text about "domains" in the guide
- Open all links from char creation in a new window
- In a card group, if any is owned, select it by default
- Add an explainer about what "add with changes" is for
- Make it clear that your race is your character card
- Include all costs in the card group heading, instead of a range: "4, 6 or 10 points" instead of "4 - 10 points",
- Allow someone to add character notes, and a bio in "finish". Replace it with the randomised character string.
- In the domains step, add links to the various domain rules
- Immediately save new characters instead of waiting until step 2
- When updating a char, redirect to the last uncompleted step
- Add a distinct style (such is italic or a color change) defined terms. For example "sturdy stance 1" in "tellurian"
- Add a way for people to learn about common terms such as "charm", "DC, "blessing", "medium weapon", "R", "C".
- When you check "dormant" in "add with changes", the points and upkeep fields should get disabled
- Merge step 3 and 4, so that people can buy skills and items together.
- Put "priest" before "ceremony master", priest is the more important skill.
- Explain what dormant skills are, maybe in the guide?
- Show a "total HP" in finish, including armor and combat mobility
- Show a "total WP" considering
- Consider "loan" as part of your total coppers
- Make better user of store getters
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

## Handle custom rules

- "You receive a free Materal Compendium item when you acquire this skill."
- "If you have XX points worth of non-dormant skills or conditions in a single domain this condition is free."
- "You have an additional Xℜ each month."
- "Retraining dormant skills costs 5ℜ per point"
- "Once per month you can reduce the cost of training a skill with 7ℜ"
- "You gain the Sturdy Stance 1 skill and it costs 2ℜ less to maintain"

## Fix Heimr stuff

- loan / loan use counters instead of levels
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
