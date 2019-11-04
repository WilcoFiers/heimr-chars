<template>
  <main>
    <h1>My Characters</h1>
    <ul v-if="characters">
      <li v-for="(char, index) in characters" :key="index">{{ char.name }}</li>
    </ul>
    <CreateCharacter />
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import CreateCharacter from "@/components/CreateCharacter.vue";
import { db, charactersRef } from "@/firebase";

export default Vue.extend({
  name: "CharacterList",
  computed: {
    characters() {
      return this.$store.state.characters;
    }
  },
  components: { CreateCharacter }
});
</script>