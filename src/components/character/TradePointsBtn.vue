<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" v-bind="$attrs">Trade points for cash</v-btn>
      </template>

      <v-card>
        <v-card-title primary-title>Trade points for cash</v-card-title>

        <v-card-text>
          <p>
            You can exchange
            <strong>up to 5 points</strong> into cash,
            <strong>100c per point</strong>
          </p>
          <v-slider
            v-model="current"
            step="20"
            ticks="always"
            tick-size="8"
            :tick-labels="ticksLabels"
          ></v-slider>
          <div class="d-flex">
            <span>{{ points }} starting points</span>
            <v-spacer />
            <span>{{ cash }}¢ starting cash</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text @click="cancel">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="confirm">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "TradePointsBtn",
  inheritAttrs: false,

  props: {
    value: {
      type: Number,
      default: 0
    },
    maxPoints: {
      type: Number,
      default: 20
    },
    maxCash: {
      type: Number,
      default: 500
    },
    exchangeRate: {
      type: Number,
      default: 100
    }
  },
  data() {
    const ticksLabels = ["0", "1", "2", "3", "4", "5"];
    const dialog = false;
    const current = this.value * 20;
    return { dialog, current, ticksLabels };
  },
  watch: {
    value(val) {
      this.current = val * 20;
    }
  },

  computed: {
    points(): number {
      const remove = Math.round(this.current / 20);
      return this.maxPoints - remove;
    },
    cash(): number {
      const add = Math.round(this.current / 20);
      return this.maxCash + add * this.exchangeRate;
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.current = this.value * 20;
    },

    confirm() {
      this.dialog = false;
      const newValue = this.current / 20;
      if (newValue !== this.value) {
        this.$emit("updateStartingPoints", newValue);
      }
    }
  }
});
</script>
