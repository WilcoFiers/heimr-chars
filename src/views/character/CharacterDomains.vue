<template>
  <v-container>
    <v-row>
      <h1>{{ character.name }}'s Domains</h1>
      <v-spacer />
      <ResourceMini
        :rules="rules"
        :money="500"
        :resources="20"
        to="./resources"
      />
    </v-row>
    <v-row>
      <DomainSelection :ownedDomains="ownedDomains()" />
    </v-row>

    <v-row class="px-5">
      <v-btn to="./"> <v-icon>mdi-arrow-left</v-icon>Name &amp; Race </v-btn>
      <v-spacer />
      <v-btn class="primary" to="./resources">
        Next: Resources
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
import { Character, State, CharacterRule } from "@/types";

export default Vue.extend({
  name: "CharacterDomains",
  components: { DomainSelection, ResourceMini },

  computed: {
    character(): Character {
      return (
        (this.$store.state as State).character.charProps || ({} as Character)
      );
    },
    rules(): CharacterRule[] {
      const { rules } = (this.$store.state as State).character;
      return rules || [];
    }
  },

  methods: {
    ownedDomains(): string[] {
      const ownedDomains: Set<string> = new Set();
      const { character } = this.$store.state as State;
      if (!character || !character.rules) {
        return [];
      }

      character.rules.forEach(({ domainName }) => ownedDomains.add(domainName));
      return Array.from(ownedDomains);
    }
  }
});
</script>
