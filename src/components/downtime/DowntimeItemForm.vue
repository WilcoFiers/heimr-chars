<template>
  <v-form @submit.prevent="validateAndSubmit" ref="form">
    <v-text-field
      :label="ruleCard.name"
      type="string"
      v-model="nameDetailValue"
      v-if="needsNameDetail"
      :rules="[required]"
    />

    <v-select
      label="price type"
      :items="priceTypes"
      v-model="priceType"
      v-if="activity === 'add'"
    />

    <v-text-field
      label="cost"
      type="number"
      v-if="activity === 'add' && priceType !== ''"
      v-model="priceValue"
    />
    <div class="text-right">
      <v-btn
        class="primary"
        :disabled="disabled"
        v-text="activity"
        type="submit"
      />
    </div>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { CharacterRule, RuleCard, NewDowntimeItem, Domain } from "@/types";

export type PartialDowntimeItem = Partial<NewDowntimeItem> & {
  type: string;
  domainName?: string;
  cardName: string;
  cardNameDetails?: string;
};

const priceTypes = [
  { value: "", text: "Free" },
  { value: "actions", text: "Resources (ℜ)" },
  { value: "exchanges", text: "Coppers (¢)" }
];

export default Vue.extend({
  name: "DowntimeItemForm",
  props: {
    characterRule: Object,
    ruleCard: Object,
    disabled: Boolean,
    activity: String
  },

  data() {
    return {
      priceType: "" as string,
      priceValue: "" as string,
      nameDetailValue: "" as string,
      required: (val: string) => val !== "" || "Field must be filled out",
      priceTypes
    };
  },

  computed: {
    needsNameDetail(): boolean {
      if (!this.ruleCard) {
        return false;
      }
      return this.ruleCard.name.includes(" ...");
    }
  },

  methods: {
    validateAndSubmit() {
      // @ts-ignore
      if (!this.$refs.form.validate()) {
        return;
      }

      let downtimeItem: PartialDowntimeItem;
      if (this.characterRule) {
        downtimeItem = {
          cardName: this.characterRule.name,
          type: this.characterRule.type,
          domainName: this.characterRule.domainName,
          id: this.characterRule.id
        };
      } else if (this.ruleCard) {
        downtimeItem = {
          cardName: this.ruleCard.name,
          type: this.ruleCard.type
        };
      } else {
        throw new Error("Can not add downtime item. Unknown card");
      }
      if (this.needsNameDetail) {
        downtimeItem.cardNameDetails = this.nameDetailValue;
      }

      if (this.priceType === "actions") {
        downtimeItem.cost = parseInt(this.priceValue) || 0;
      } else if (this.priceType === "exchanges") {
        downtimeItem.cost = 0 - (parseInt(this.priceValue) || 0);
      }

      let downtimeProp = this.priceType || "actions";
      this.$emit("submit", { downtimeProp, downtimeItem });
    },

    reset() {
      this.priceType = "";
      this.priceValue = "";
    }
  }
});
</script>
