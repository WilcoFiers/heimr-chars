<template>
  <CharacterOverview new />
</template>

<script lang="ts">
import Vue from "vue";
import CharacterOverview from "@/components/character/CharacterOverview.vue";

export default Vue.extend({
  name: "CharacterNew",
  components: { CharacterOverview }
});
</script>
