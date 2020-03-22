<template>
  <v-card>
    <v-card-title class="subtitle-1 d-flex pb-0 justify-space-between">
      <strong>Downtime Resources</strong>
      <span v-text="downtimeComputed.resourcesTotal + 'ℜ'" />
    </v-card-title>

    <v-row class="mx-3" dense v-if="!downtimeComputed.complete">
      <v-col>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              Skills
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(skillAction, index) in skillActions"
              :key="index"
              :disabled="skillAction.disabled"
              @click="addDowntimeAction(skillAction)"
              v-text="skillAction.title"
            />
          </v-list>
        </v-menu>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              Conditions
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(conditionAction, index) in conditionActions"
              :key="index"
              :disabled="conditionAction.disabled"
              @click="addDowntimeAction(conditionAction)"
              v-text="conditionAction.title"
            />
          </v-list>
        </v-menu>
        <v-btn text @click="otherAction = !otherAction">
          <v-icon left
            >mdi-checkbox-{{ otherAction ? "marked" : "blank" }}-outline</v-icon
          >Other
        </v-btn>
      </v-col>
    </v-row>

    <transition name="fade">
      <v-row class="mx-3 mb-3" dense v-show="otherAction">
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
          <v-btn icon class="mt-3" @click="addCustomDowntimeItem">
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
        <v-list-item-avatar
          v-text="downtimeItem.cost ? `-${downtimeItem.cost}ℜ` : '0ℜ'"
        />
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

type ActionItem = {
  title: string;
  activity: string;
  cardType: "skill" | "condition";
  disabled?: boolean;
};

const skillActions: ActionItem[] = [
  {
    title: "Train a new skill",
    activity: "add",
    cardType: "skill",
    disabled: true
  },
  {
    title: "Change a skill level",
    activity: "upgrade",
    cardType: "skill",
    disabled: true
  },
  {
    title: "Make a skill dormant",
    activity: "remove",
    cardType: "skill"
  },
  {
    title: "Retrain a dormant skill",
    activity: "dormant",
    cardType: "skill",
    disabled: true
  }
];

const conditionActions: ActionItem[] = [
  {
    title: "Add a condition",
    activity: "add",
    cardType: "condition"
  },
  {
    title: "Remove a condition",
    activity: "remove",
    cardType: "condition",
    disabled: true
  }
];

export default Vue.extend({
  name: "DowntimeActions",
  props: {
    downtimeComputed: Object
  },
  data() {
    return {
      titleField: "" as string,
      costField: "" as string,
      otherAction: false as boolean,
      skillActions: skillActions as ActionItem[],
      conditionActions: conditionActions as ActionItem[]
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
    subTitle({ cardName, cardNameDetails }: DowntimeItem): string {
      return (cardName || "").replace("...", cardNameDetails || "...");
    },

    addDowntimeAction(action: ActionItem) {
      this.$emit("addItem", action);
    },

    addCustomDowntimeItem() {
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
      const remove = this.downtimeComputed.actions.length - index - 1;
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
