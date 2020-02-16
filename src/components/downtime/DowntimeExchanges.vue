<template>
  <v-card>
    <v-card-title class="subtitle-1 d-flex pb-0 justify-space-between">
      <strong>Wealth, before downtime</strong>
      <span v-text="downtimeComputed.coppersAtStart + '¢'" />
    </v-card-title>

    <v-row v-if="!downtimeComputed.complete" class="mx-3 mb-3" dense>
      <v-col class="flex-grow-1 flex-shrink-1">
        <v-text-field
          label="Downtime spending"
          v-model="titleField"
          :hide-details="true"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="Coppers"
          v-model="costField"
          :hide-details="true"
          type="number"
        />
      </v-col>
      <v-col class="flex-grow-0">
        <v-btn icon class="mt-3" @click="addDowntimeItem">
          <v-icon>mdi-plus-thick</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-list>
      <v-list-item
        v-for="({ title, cost, subTitle }, index) in downtimeItems"
        :key="index"
        @click="removeDowntimeItem(index)"
      >
        <v-list-item-icon class="mr-3" v-if="!downtimeComputed.complete">
          <v-icon v-text="'mdi-delete-outline'" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="title" />
          <v-list-item-subtitle v-if="subTitle" v-text="subTitle" />
        </v-list-item-content>
        <v-list-item-avatar v-text="`${cost}¢`" />
      </v-list-item>

      <v-list-item class="d-flex justify-space-between">
        <em
          >Income from Dayjob ({{ downtimeComputed.unspentResources }}ℜ x
          {{ downtimeComputed.resourceValue }}¢)</em
        >
        <span>{{ downtimeComputed.dayjobIncome }}¢</span>
      </v-list-item>
      <v-list-item class="d-flex justify-space-between">
        <em>Cost of living</em>
        <span>-{{ downtimeComputed.costOfLivingTotal }}¢</span>
      </v-list-item>
    </v-list>

    <v-divider />
    <div class="d-flex justify-space-between pa-4">
      <span v-text="'Wealth, after downtime'" />
      <span v-text="downtimeComputed.cashAfter + '¢'" />
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DowntimeComputed, DowntimeItem } from "@/types";

export default Vue.extend({
  name: "DowntimeExchanges",
  props: {
    downtimeComputed: Object,
    characterInfo: Object
  },
  data() {
    return {
      titleField: "" as string,
      costField: "" as string
    };
  },
  computed: {
    downtimeItems(): DowntimeItem[] {
      const { exchanges } = this.downtimeComputed as DowntimeComputed;
      // Copy, as to not manipulate the original
      return exchanges.concat().reverse();
    }
  },
  methods: {
    addDowntimeItem() {
      if (this.downtimeComputed.complete) {
        return;
      }
      this.$emit("addItem", {
        title: this.titleField,
        cost: Number(this.costField || 0)
      });

      // reset
      this.titleField = "";
      this.costField = "";
    },

    removeDowntimeItem(index: number) {
      if (this.downtimeComputed.complete) {
        return;
      }
      this.$emit("removeItem", index);
    }
  }
});
</script>