<template>
  <v-card>
    <v-card-title class="primary--text"
      >Duration of this Downtime Period</v-card-title
    >
    <v-card-text>
      <v-text-field
        label="months"
        v-model="current"
        type="number"
        :rules="rules"
        ref="durationField"
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
      current: this.duration as number | string,
      rules: [
        (val: number) => val < 1 && "Must be at least 1 month",
        (val: number) => val > 12 && "Must be no more than 12 month"
      ]
    };
  },
  methods: {
    save() {
      if (this.durationField.validate()) {
        this.$emit("save", parseInt(this.current + ""));
      }
    },
    reset() {
      this.current = this.duration;
    },
    cancel() {
      this.reset();
      this.$emit("cancel");
    }
  },
  computed: {
    durationField(): {
      validate: () => boolean;
    } {
      // @ts-ignore
      return this.$refs.durationField;
    }
  }
});
</script>
