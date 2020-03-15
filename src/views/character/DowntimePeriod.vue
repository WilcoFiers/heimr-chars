<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <h1>Downtime</h1>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        class="text-left text-sm-right"
        v-if="downtimeComputed.complete"
      >
        {{
          downtimePeriod.duration +
            " month" +
            (downtimePeriod.duration !== 1 ? "s" : "")
        }}
        <v-icon right>mdi-calendar</v-icon>
      </v-col>
      <v-col cols="12" sm="6" class="text-left text-sm-right" v-else>
        <v-btn text @click="durationDialog = true">
          {{
            downtimePeriod.duration +
              " month" +
              (downtimePeriod.duration !== 1 ? "s" : "")
          }}
          <v-icon right>mdi-calendar</v-icon>
        </v-btn>
        <v-btn text @click="modifyDialog = true">
          Modify
          <v-icon right>mdi-pencil</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <DowntimeActions
          :downtimeComputed="downtimeComputed"
          @addItem="setDowntimeItemModal('actions', $event)"
          @addCustomItem="addDowntimeItem('actions', $event)"
          @removeItem="removeDowntimeItem('actions', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <DowntimeExchanges
          :downtimeComputed="downtimeComputed"
          :characterInfo="characterInfo"
          @addItem="addDowntimeItem('exchanges', $event)"
          @removeItem="removeDowntimeItem('exchanges', $event)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn :to="{ name: 'character-overview' }">
          <v-icon left>mdi-arrow-left-bold-outline</v-icon>Back
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-right" v-if="!downtimeComputed.complete">
        <v-btn @click="completeDialog = true" class="primary">
          Complete
          <v-icon right>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="completeDialog" max-width="400">
      <v-card>
        <v-card-title>Complete Downtime Period?</v-card-title>
        <v-card-text>
          Once completed, the downtime period is final. It can not be updated.
        </v-card-text>
        <v-card-actions>
          <v-btn @click="completeDialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn class="primary" @click="completeDowntime">Complete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="durationDialog"
      max-width="400"
      @click:outside="$refs.durationForm.reset()"
    >
      <DowntimeDurationForm
        :duration="downtimePeriod.duration"
        @cancel="durationDialog = false"
        @save="
          durationDialog = false;
          updateDuration($event);
        "
        ref="durationForm"
      />
    </v-dialog>

    <v-dialog
      v-model="modifyDialog"
      max-width="500"
      @click:outside="$refs.modifyForm.reset()"
    >
      <DowntimeModifiersForm
        :downtimePeriod="downtimePeriod"
        @cancel="modifyDialog = false"
        @save="
          modifyDialog = false;
          updateFields($event);
        "
        ref="modifyForm"
      />
    </v-dialog>

    <DowntimeItemDialog
      max-width="600"
      :title="downtimeModalItem && downtimeModalItem.title"
      :cardType="downtimeModalItem && downtimeModalItem.cardType"
      :action="downtimeModalItem && downtimeModalItem.action"
      :charRules="charRules"
      :downtimeItems="downtimePeriod.actions"
      v-model="showModal"
      @action="addDowntimeItem('actions', $event)"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  CharacterInfo,
  DowntimeItem,
  NewDowntimePeriod,
  State,
  DowntimeComputed,
  DowntimePeriod,
  CharacterRule
} from "@/types";
import { getDowntimeDefault, getDowntimeComputed } from "@/heimr/downtime";

import DowntimeDurationForm from "@/components/downtime/DowntimeDurationForm.vue";
import DowntimeModifiersForm from "@/components/downtime/DowntimeModifiersForm.vue";
import DowntimeActions from "@/components/downtime/DowntimeActions.vue";
import DowntimeExchanges from "@/components/downtime/DowntimeExchanges.vue";
import DowntimeItemDialog from "@/components/downtime/DowntimeItemDialog.vue";

export default Vue.extend({
  name: "DowntimePeriod",
  components: {
    DowntimeDurationForm,
    DowntimeModifiersForm,
    DowntimeActions,
    DowntimeExchanges,
    DowntimeItemDialog
  },

  data: () => ({
    modifyDialog: false as boolean,
    durationDialog: false as boolean,
    completeDialog: false as boolean,
    timeModal: false as boolean,
    downtimeExchangeTitle: "" as string,
    downtimeExchangeCost: undefined as number | undefined,
    downtimeDefault: getDowntimeDefault(),
    downtimeModalItem: undefined as undefined | DowntimeItem,
    showModal: false as boolean
  }),

  computed: {
    charRules(): CharacterRule[] {
      return (this.$store.state.character.rules || []) as CharacterRule[];
    },

    characterInfo(): CharacterInfo {
      return this.$store.getters.characterInfo;
    },

    downtimePeriod(): NewDowntimePeriod {
      const downtimeId = this.$route.params.downtimeId;
      const { downtimePeriods } = (this.$store.state as State).character;
      let downtimePeriod = getDowntimeDefault();
      if (downtimePeriods) {
        downtimePeriod =
          downtimePeriods.find(({ id }) => id === downtimeId) || downtimePeriod;
      }
      return downtimePeriod;
    },

    downtimeComputed(): DowntimeComputed {
      return getDowntimeComputed(this.downtimePeriod);
    }
  },

  methods: {
    updateDuration(duration: number) {
      this.$store.dispatch("updateDowntimePeriod", {
        id: this.$route.params.downtimeId,
        duration
      });
    },

    updateFields(fields: Partial<NewDowntimePeriod>) {
      this.$store.dispatch("updateDowntimePeriod", {
        id: this.$route.params.downtimeId,
        ...fields
      });
    },

    setDowntimeItemModal(
      propName: "actions" | "exchanges",
      downtimeItem: DowntimeItem
    ) {
      this.downtimeModalItem = downtimeItem;
      this.showModal = true;
      return;
    },

    addDowntimeItem(
      propName: "actions" | "exchanges",
      downtimeItem: DowntimeItem
    ) {
      const { downtimeId } = this.$route.params;
      this.$store.dispatch("addDowntimeItem", {
        propName,
        downtimeItem,
        downtimeId
      });
    },

    removeDowntimeItem(propName: "actions" | "exchanges", index: number) {
      const { downtimeId } = this.$route.params;
      this.$store.dispatch("removeDowntimeItem", {
        propName,
        index,
        downtimeId
      });
    },

    completeDowntime() {
      const { downtimeId } = this.$route.params;
      this.$store.dispatch("completeDowntimePeriod", downtimeId);
      this.$router.push({ name: "character-overview" });
    }
  }
});
</script>
