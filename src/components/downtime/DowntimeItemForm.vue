<template>
  <v-form @submit.prevent="validateAndSubmit" ref="form">
    <v-text-field
      :label="ruleCard.name"
      type="string"
      v-model="nameDetailValue"
      v-if="activity === 'add' && needsNameDetail"
      :rules="[required]"
    />

    <v-select
      label="price type"
      :items="priceTypes"
      v-model="priceType"
      v-if="variablePriceType"
    />

    <v-text-field
      type="number"
      v-if="variablePrice.editable"
      :label="variablePrice.label"
      :suffix="variablePrice.unit"
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
  type: "skill" | "condition" | "item" | "consumable";
  id?: string;
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
    let priceValue = "";
    if (this.ruleCard.marketPrice && this.ruleCard.marketPrice !== "Var") {
      priceValue = this.ruleCard.marketPrice.replace("¢", "");
      if (this.activity === "remove") {
        priceValue = String(parseInt(priceValue) / 2 || 0);
      }
    }

    return {
      priceType: "" as string,
      priceValue: priceValue as string,
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
    },

    variablePriceType(): boolean {
      return this.activity === "add" && this.cardType === "condition";
    },

    variablePrice(): { editable?: boolean; label?: string; unit?: string } {
      if (this.variablePriceType && this.priceType) {
        return {
          editable: true,
          label: "cost",
          unit: this.priceType === "actions" ? "ℜ" : "¢"
        };
      }
      if (this.cardType === "item" || this.cardType === "consumable") {
        return {
          editable: true,
          label: "price",
          unit: "¢"
        };
      }
      return {};
    },

    cardType(): string {
      return this.ruleCard?.type || this.characterRule.type;
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

      if (this.variablePrice.editable && this.priceValue) {
        downtimeItem.cost = parseInt(this.priceValue) || 0;
        if (
          (this.priceType === "exchanges" && this.cardType === "condition") ||
          (this.activity === "add" &&
            ["item", "consumable"].includes(this.cardType))
        ) {
          downtimeItem.cost = 0 - downtimeItem.cost;
        }
      }

      let downtimeProp;
      if (this.priceType) {
        downtimeProp = this.priceType;
      } else if (this.cardType === "item" || this.cardType === "consumable") {
        downtimeProp = "exchanges";
      } else {
        downtimeProp = "actions";
      }
      this.$emit("submit", { downtimeProp, downtimeItem });
    },

    reset() {
      this.priceType = "";
      this.priceValue = "";
    }
  }
});
</script>
