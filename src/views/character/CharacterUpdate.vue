<template>
  <CharacterOverview
    :updateCharacter="character"
    @save="updateChar"
    @archive="archiveChar"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Character } from "@/types";
import {
  default as CharacterOverview,
  CharacterMeta
} from "@/components/character/CharacterOverview.vue";

export default Vue.extend({
  name: "CharacterUpdate",
  components: { CharacterOverview },

  computed: {
    character(): Character | undefined {
      const { charId } = this.$route.params;
      const { characters } = this.$store.state;
      const character = characters.find(
        (char: { id: string }) => char.id == charId
      );
      if (!character) {
        return undefined;
      }
      // Create a copy, so we can update without changing the store
      return Object.assign({}, character);
    }
  },

  methods: {
    updateChar({ name, race }: CharacterMeta) {
      const { charId } = this.$route.params;
      this.$store.dispatch("updateCharacter", { name, race, charId });
      this.$router.push(`/characters/${charId}/domains`);
    },

    archiveChar(): void {
      const { charId } = this.$route.params;
      this.$store.dispatch("archiveCharacter", charId);
      this.$router.push(`/characters/`);
    }
  }
});
</script>
