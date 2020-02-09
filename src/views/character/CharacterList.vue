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
        md="9"
        lg="6"
        xl="4"
        v-for="char in characters"
        :key="char.id"
      >
        <v-card :to="charUri(char)" height="100%">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title
                class="headline mb-1 d-flex justify-space-between align-center"
              >
                <span>{{ char.name }}</span>
                <v-chip
                  v-if="!char.isComplete"
                  small
                  class="caption secondary--text"
                  >New</v-chip
                >
              </v-list-item-title>
              <v-list-item-subtitle>{{ summary(char) }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="50" color="grey">
              <IconImage :asset="raceImg(char.race)" contain />
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          cols="12"
          md="9"
          lg="6"
          xl="4"
          to="/characters/new/create/origin"
        >
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
import { Character, State } from "@/types";
import { raceImg } from "@/heimr-data";
import IconImage from "@/components/IconImage.vue";
import { randomBio } from "./creation/randomBio";

export default Vue.extend({
  name: "CharacterList",
  components: { IconImage },
  computed: {
    characters() {
      return (this.$store.state as State).character.list;
    }
  },
  methods: {
    raceImg,
    charUri({ id, isComplete }: Character) {
      if (isComplete) {
        return `/characters/${id}`;
      } else {
        return `/characters/${id}/create`;
      }
    },
    summary(char: Character) {
      return char.shortBio || randomBio(char);
    }
  }
});
</script>
