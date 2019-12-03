<template>
  <div>
    <v-btn
      v-on="$listeners"
      v-bind="$attrs"
      :class="{ 'right-connect': this.$slots.menu }"
    >
      <slot />
    </v-btn>
    <v-menu offset-y left v-if="this.$slots.menu">
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          width="34"
          min-width="34"
          v-bind="$attrs"
          class="left-connect"
          :aria-label="menuLabel"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <slot name="menu" />
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "OptionsBtn",
  inheritAttrs: false,
  props: {
    menuLabel: {
      type: String,
      default: "Expand options"
    }
  }
});
</script>

<style scoped>
.left-connect {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.right-connect {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-right: -1px;
}
</style>
