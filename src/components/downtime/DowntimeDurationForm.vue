<template>
  <v-card>
    <v-card-title class="primary--text">Months in Downtime</v-card-title>
    <v-card-text>
      <v-slider
        aria-label="Months in downtime"
        :tick-labels="[1, 2, 3, 4, 5, 6]"
        v-model="current"
        :min="1"
        :max="6"
        ticks="always"
        tick-size="4"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="cancel">Cancel</v-btn>
      <v-spacer />
      <v-btn @click="save" class="primary">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DowntimeDurationForm",
  props: {
    duration: Number
  },
  data() {
    return {
      current: this.duration as number
    };
  },
  methods: {
    save() {
      this.$emit("save", this.current);
    },
    reset() {
      this.current = this.duration;
    },
    cancel() {
      this.reset();
      this.$emit("cancel");
    }
  }
});
</script>
