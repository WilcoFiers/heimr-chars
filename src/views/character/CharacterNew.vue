<template>
  <CharacterOverview @save="addChar" :saving="loading" />
</template>

<script lang="ts">
import Vue from "vue";
import CharacterOverview, {
  CharacterMeta
} from "@/components/character/CharacterOverview.vue";

export default Vue.extend({
  name: "CharacterNew",
  data() {
    return { saving: false };
  },
  components: { CharacterOverview },

  methods: {
    async addChar({ name, race }: CharacterMeta) {
      if (this.saving) {
        return; // Prevent repeat runs
      }
      this.saving = true;
      const charId = await this.$store.dispatch("createCharacter", {
        name,
        race
      });
      this.saving = false;
      this.$router.push(`/characters/${charId}/domains`);
    }
  }
});
</script>
