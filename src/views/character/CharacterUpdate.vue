<template>
  <CharacterOverview :charId="charId" />
</template>

<script lang="ts">
import Vue from "vue";
import CharacterOverview from "@/components/character/CharacterOverview.vue";

export default Vue.extend({
  name: "CharacterUpdate",
  computed: {
    charId() {
      return this.$route.params.charId;
    }
  },
  components: { CharacterOverview }
});
</script>
