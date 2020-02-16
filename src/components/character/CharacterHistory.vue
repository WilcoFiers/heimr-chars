<template>
  <v-card>
    <v-card-title class="pb-0">History</v-card-title>
    <v-card-actions>
      <slot />
    </v-card-actions>

    <v-timeline dense class="historyLine">
      <v-timeline-item
        v-for="(historyItem, index) in historyItems"
        :key="index"
        :icon="historyItem.icon"
      >
        <router-link
          v-if="historyItem.to"
          :to="historyItem.to"
          v-text="historyItem.text"
        />
        <span v-else v-text="historyItem.text" />
      </v-timeline-item>
    </v-timeline>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DowntimePeriod } from "@/types";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

type HistoryItem = {
  text: string;
  icon: string;
  to?: {
    name: "downtime-period";
    params: { downtimeId: string };
  };
};

export default Vue.extend({
  name: "CharacterHistory",
  props: {
    downtimePeriods: Array,
    events: Array,
    createdAt: Number
  },

  computed: {
    createdAtDate(): string {
      const createdAt = new Date(this.createdAt);
      const month = months[createdAt.getMonth()];
      const year = createdAt.getFullYear();
      return `${month} ${year}`;
    },

    historyItems(): HistoryItem[] {
      const history: HistoryItem[] = [];
      history.push({
        icon: "mdi-account",
        text: "Created, " + this.createdAtDate
      });

      (this.downtimePeriods as DowntimePeriod[]).forEach(({ duration, id }) => {
        const params = { downtimeId: id };
        history.push({
          icon: "mdi-calendar-month",
          text: `${duration} month${duration !== 1 ? "s" : ""} downtime`,
          to: { name: "downtime-period", params }
        });
      });
      return history.reverse();
    }
  }
});
</script>

<style scoped>
.historyLine {
  margin-left: -12px;
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
