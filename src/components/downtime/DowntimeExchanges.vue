<template>
  <v-card>
    <v-card-title class="subtitle-1 d-flex pb-0 justify-space-between">
      <strong>Wealth, before downtime</strong>
      <span v-text="downtimeComputed.coppersAtStart + '¢'" />
    </v-card-title>

    <v-row class="mx-3" dense v-if="!downtimeComputed.complete">
      <v-col>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              Buy
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(buyActivity, index) in buyActivities"
              :key="index"
              @click="addDowntimeExchange(buyActivity)"
              v-text="buyActivity.title"
            />
          </v-list>
        </v-menu>

        <v-btn text disabled>
          <v-icon left>mdi-cash-multiple</v-icon>Sell
        </v-btn>
        <v-btn text @click="otherExchange = !otherExchange">
          <v-icon left>
            mdi-checkbox-{{
              otherExchange ? "marked" : "blank"
            }}-outline </v-icon
          >Other
        </v-btn>
      </v-col>
    </v-row>

    <transition name="fade">
      <v-row v-show="otherExchange" class="mx-3 mb-3" dense>
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
    </transition>

    <v-list>
      <v-list-item
        v-for="(downtimeItem, index) in downtimeItems"
        :key="index"
        @click="removeDowntimeItem(index)"
      >
        <v-list-item-icon class="mr-3" v-if="!downtimeComputed.complete">
          <v-icon v-text="'mdi-delete-outline'" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="downtimeItem.title" />
          <v-list-item-subtitle
            v-if="downtimeItem.cardName"
            v-text="subTitle(downtimeItem)"
          />
        </v-list-item-content>
        <v-list-item-avatar v-text="`${downtimeItem.cost}¢`" />
      </v-list-item>

      <v-list-item class="d-flex justify-space-between">
        <em>
          Income from Dayjob ({{ downtimeComputed.unspentResources }}ℜ x
          {{ downtimeComputed.resourceValue }}¢)
        </em>
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

type ExchangeItem = {
  title: string;
  activity: string;
  cardType: "item" | "consumable";
  disabled?: boolean;
};

const buyActivities: ExchangeItem[] = [
  {
    title: "Buy an item",
    activity: "add",
    cardType: "item"
  },
  {
    title: "Buy an consumable",
    activity: "add",
    cardType: "consumable"
  }
];

export default Vue.extend({
  name: "DowntimeExchanges",
  props: {
    downtimeComputed: Object,
    characterInfo: Object
  },
  data() {
    return {
      titleField: "" as string,
      costField: "" as string,
      otherExchange: false as boolean,
      buyActivities: buyActivities as ExchangeItem[]
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
    subTitle({ cardName, cardNameDetails }: DowntimeItem): string {
      return (cardName || "").replace("...", cardNameDetails || "...");
    },

    addDowntimeExchange(item: ExchangeItem) {
      this.$emit("addItem", item);
    },

    addDowntimeItem() {
      if (this.downtimeComputed.complete) {
        return;
      }
      this.$emit("addCustomItem", {
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
      // Undo the reverse
      const remove = this.downtimeComputed.exchanges.length - index - 1;
      this.$emit("removeItem", remove);
    }
  }
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
