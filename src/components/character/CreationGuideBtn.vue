<template>
  <span>
    <v-btn class="secondary" @click="infoDialog = true" v-bind="$attrs">
      <slot><v-icon left>mdi-help-circle-outline</v-icon>Guide</slot>
    </v-btn>
    <v-dialog v-model="infoDialog" max-width="800">
      <CreationGuide>
        <v-spacer />
        <v-btn text @click="infoDialog = false">Continue</v-btn>
      </CreationGuide>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import CreationGuide from "./CreationGuide.vue";

export default Vue.extend({
  name: "CreationGuideBtn",
  inheritAttrs: false,
  components: { CreationGuide },
  props: {
    initialState: Boolean
  },
  data() {
    return { infoDialog: !!this.initialState };
  }
});
</script>
