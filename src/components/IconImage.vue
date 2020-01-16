<template>
  <v-img :src="content" class="image" v-bind="$attrs" />
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "IconImage",
  props: {
    asset: String
  },
  computed: {
    content() {
      let source: string = (this.asset as string) || "";
      if (!source.includes(".png")) {
        source += ".png";
      }
      return require(`../assets/${source}`);
    }
  }
});
</script>

<style lang="scss" scoped>
.image {
  background: var(--v-secondary-base);
  border-radius: 6px;
}
</style>
