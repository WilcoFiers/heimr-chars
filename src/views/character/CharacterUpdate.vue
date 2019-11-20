<template>
  <CharacterOverview
    :updateCharacter="character"
    @save="updateChar"
    @archive="archiveChar"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Character, CharacterRule } from "@/types";
import { State } from "@/store";
import CharacterOverview, {
  CharacterMeta
} from "@/components/character/CharacterOverview.vue";

export default Vue.extend({
  name: "CharacterUpdate",
  components: { CharacterOverview },

  computed: {
    character(): Character | undefined {
      return (this.$store.state as State).character.charProps;
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
