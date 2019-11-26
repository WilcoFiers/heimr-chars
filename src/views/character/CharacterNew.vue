<template>
  <CharacterOverview @save="addChar" />
</template>

<script lang="ts">
import Vue from "vue";
import CharacterOverview, {
  CharacterMeta
} from "@/components/character/CharacterOverview.vue";

export default Vue.extend({
  name: "CharacterNew",
  components: { CharacterOverview },

  methods: {
    async addChar({ name, race }: CharacterMeta) {
      const charId = await this.$store.dispatch("createCharacter", {
        name,
        race
      });
      this.$router.push(`/characters/${charId}/domains`);
    }
  }
});
</script>
