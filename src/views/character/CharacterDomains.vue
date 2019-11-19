<template>
  <v-container>
    <v-row>
      <h1>{{ character.name }}'s Domains</h1>
      <v-spacer />
      <ResourceMini
        :rules="rules"
        :money="500"
        :resources="20"
        :to="resources()"
      />
    </v-row>
    <v-row>
      <DomainSelection />
    </v-row>

    <v-row class="px-5">
      <v-btn :to="back()">
        <v-icon>mdi-arrow-left</v-icon>Name &amp; Race
      </v-btn>
      <v-spacer />
      <v-btn type="submit" class="primary">
        Next: Items &amp; Money
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DomainSelection from "@/components/DomainSelection.vue";
import ResourceMini from "@/components/character/ResourceMini.vue";
import { getCharacterRulesCol } from "@/firebase";
import { Character, State } from "@/types";

export default Vue.extend({
  name: "CharacterDomains",
  components: { DomainSelection, ResourceMini },
  data() {
    return { rules: [] };
  },
  computed: {
    character(): Character | undefined {
      const { charId } = this.$route.params;
      const characters = (this.$store.state as State).character.list;

      const character = characters.find(char => char.id == charId);
      if (!character) {
        return undefined;
      }
      // Create a copy, so we can update without changing the store
      return Object.assign({}, character);
    }
  },
  methods: {
    resources() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/resources`;
    },
    back() {
      const { charId } = this.$route.params;
      return `/characters/${charId}`;
    }
  },

  firestore() {
    const rules = getCharacterRulesCol(this.$route.params.charId);
    return { rules };
  }
});
</script>
