<template>
  <v-card>
    <v-card-title class="secondary white--text">
      <h2 class="title">
        <v-icon left class="white--text">mdi-help-circle-outline</v-icon
        >Creating a Heimrian
      </h2>
    </v-card-title>
    <v-card-text class="pt-2">
      <p>
        Before you begin, it is helpful know the
        <router-link to="/books/core-rules">core rules</router-link>. To create
        a new character, you will go through the following steps:
      </p>
      <ol>
        <li>Pick the <strong>race</strong> of your character</li>
        <li>
          Choose
          <strong><dfn>domains</dfn></strong> for your character. We recommend
          no more than 3 domains.
        </li>
        <li>
          Choose <strong><dfn>skills</dfn> and <dfn>conditions</dfn></strong
          >. Spend 15 to 20 points in the chosen domains.
        </li>
        <li>
          <strong>Buy <dfn>items</dfn></strong>
          for your character. You have 500¢, plus 100¢ for each unspent point.
          What's left is your starting cash.
        </li>
      </ol>

      <h3>Domains</h3>
      <p>
        A collection of skills, conditions and items often used together. For
        example "battlefield surgery" has all skills related to surgery and
        stitching up wounds, all items necessary for it, and conditions releated
        to recovering from surgery.
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
