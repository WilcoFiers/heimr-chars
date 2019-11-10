<template>
  <v-container>
    <h1>My Characters</h1>
    <v-layout wrap justify-start>
      <v-flex
        xs-6
        md-4
        lg-3
        xl-2
        v-for="(char, index) in characters"
        :key="index"
      >
        <v-card min-width="250" :to="charUri(char)" class="mx-4 my-4">
          <v-card-title>{{ char.name }}</v-card-title>
          <v-card-text>Some text on my card</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs-6 md-4 lg-3 xl-2>
        <v-card min-width="250" to="/characters/new" class="mx-4 my-4">
          <v-card-title>
            <v-icon left>mdi-plus-box</v-icon>New character
          </v-card-title>
          <v-card-text>Build a character from scratch</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CharacterList",
  computed: {
    characters() {
      return this.$store.state.characters;
    }
  },
  methods: {
    charUri({ id }: { id: string }) {
      return `/characters/${id.substr(0, 8)}`;
    }
  }
});
</script>
