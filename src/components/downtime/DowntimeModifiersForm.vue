<template>
  <v-card>
    <v-card-title class="primary--text">Downtime Period Modifiers</v-card-title>
    <v-card-text>
      <p>Only modify these fields if your rule cards allows this.</p>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Resources per month"
            v-model="monthlyResources"
            type="number"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Coppers per resource"
            v-model="resourceValue"
            type="number"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Cost of living"
            v-model="costOfLiving"
            type="number"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Coppers at downtime start"
            v-model="coppersAtStart"
            type="number"
          />
        </v-col>
      </v-row>
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
import { DowntimePeriod } from "../../types";
export default Vue.extend({
  name: "DowntimeModifiersForm",
  props: {
    downtimePeriod: Object
  },
  data() {
    const downtimePeriod = this.downtimePeriod as DowntimePeriod;
    return {
      costOfLiving: downtimePeriod.costOfLiving as number | string,
      resourceValue: downtimePeriod.resourceValue as number | string,
      coppersAtStart: downtimePeriod.coppersAtStart as number | string,
      monthlyResources: downtimePeriod.monthlyResources as number | string
    };
  },
  methods: {
    save() {
      this.$emit("save", {
        costOfLiving: parseInt(this.costOfLiving + ""),
        resourceValue: parseInt(this.resourceValue + ""),
        coppersAtStart: parseInt(this.coppersAtStart + ""),
        monthlyResources: parseInt(this.monthlyResources + "")
      });
    },
    reset() {
      this.costOfLiving = this.downtimePeriod.costOfLiving;
      this.resourceValue = this.downtimePeriod.resourceValue;
      this.coppersAtStart = this.downtimePeriod.coppersAtStart;
      this.monthlyResources = this.downtimePeriod.monthlyResources;
    },
    cancel() {
      this.reset();
      this.$emit("cancel");
    }
  }
});
</script>
