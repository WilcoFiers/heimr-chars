<template>
  <v-card>
    <v-card-title class="subtitle-1 d-flex pb-0 justify-space-between">
      <strong>Downtime Resources</strong>
      <span v-text="downtimeComputed.resourcesTotal + 'ℜ'" />
    </v-card-title>

    <v-row v-if="!downtimeComputed.complete" class="mx-3 mb-3" dense>
      <v-col class="flex-grow-1 flex-shrink-1">
        <v-text-field
          label="Downtime action"
          :hide-details="true"
          v-model="titleField"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="Resources"
          type="number"
          :hide-details="true"
          v-model="costField"
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
        <v-list-item-avatar v-text="`-${cost}ℜ`" />
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="font-italic" v-text="'Skill upkeep'" />
        </v-list-item-content>
        <v-list-item-avatar
          v-text="`-${downtimeComputed.skillPointCountTotal}ℜ`"
        />
      </v-list-item>
    </v-list>

    <v-divider />
    <div class="d-flex justify-space-between pa-4">
      <span>Remainder, spent on dayjob</span>
      <span v-text="downtimeComputed.unspentResources + 'ℜ'" />
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DowntimeComputed, DowntimeItem } from "@/types";

export default Vue.extend({
  name: "DowntimeActions",
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
      const { actions } = this.downtimeComputed as DowntimeComputed;
      // Copy, as to not manipulate the original
      return actions.concat().reverse();
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
