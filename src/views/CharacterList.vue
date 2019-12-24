<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>My Characters</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        xl="3"
        v-for="char in characters"
        :key="char.id"
      >
        <v-card :to="charUri(char)" height="100%">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">
                {{ char.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ summary(char) }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="50" color="grey">
              <v-img :src="raceImg(char.race)" contain class="black" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card min-width="250" to="/characters/new">
          <v-card-title>
            <v-icon left>mdi-plus-box</v-icon>New character
          </v-card-title>
          <v-card-text>Build a character from scratch</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { State } from "@/store";
import { raceImg } from "@/heimr-data";

const adjectives = ["badass", "honourable", "woke", "wise", "humble"];
const quests = [
  "saving the innocent",
  "sailing the seas",
  "delving for gold",
  "sturggling to survive",
  "vanquishing their enemies"
];

export default Vue.extend({
  name: "CharacterList",
  computed: {
    characters() {
      return (this.$store.state as State).character.list;
    }
  },
  methods: {
    raceImg,
    charUri({ id }: { id: string }) {
      return `/characters/${id}`;
    },
    summary({ race }: { race: string }) {
      const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
      const quest = quests[Math.floor(Math.random() * adjectives.length)];
      return `A ${adjective} ${race}, ${quest}.`;
    }
  }
});
</script>
