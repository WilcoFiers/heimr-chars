<template>
  <v-card>
    <v-card-title class="secondary white--text">
      <h2 class="title">
        <v-icon left class="white--text">mdi-help-circle-outline</v-icon>How to
        create a Heimrian
      </h2>
    </v-card-title>
    <v-card-text class="pt-2">
      <p>
        Before you begin, it is helpful know the
        <a target="blank" href="http://heimr.nl/game_rules"
          >Heimr Rulebook, chapter 2: Core Rules</a
        >. To create a new character, you will go through the following steps:
      </p>
      <ol>
        <li>Pick the race of your character</li>
        <li>
          Choose
          <dfn>domains</dfn> for your character. We recommend no more than 3
          domains.
        </li>
        <li>
          Get 15 to 20 points of
          <dfn>skills</dfn> and <dfn>conditions</dfn> from the chosen domains.
        </li>
        <li>
          Buy
          <dfn>items</dfn> for your character. You have 500¢, plus 100¢ for each
          unspent point (maximum 5 points). You can keep the coppers you did not
          spend.
        </li>
      </ol>

      <h3>Domains</h3>
      <p>
        Skills, conditions and items often used together, such as for combat,
        surgery, different types of magic, or trading.
      </p>
    </v-card-text>
    <v-card-actions>
      <slot />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
h3 {
  padding-top: 6px;
}
p,
ol {
  margin: 6px 0;
}
</style>
