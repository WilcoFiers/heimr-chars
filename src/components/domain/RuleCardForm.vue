<template>
  <v-form @submit.prevent="save" ref="form">
    <v-card>
      <v-card-title class="headline">{{ ruleCard.name }}</v-card-title>
      <v-card-text>
        <p>
          Use this when another card allows you to add something with a discount
          or for free. This does not happen automatically.
        </p>
        <v-text-field
          v-if="formData.nameDetail"
          v-model="formData.nameDetail.value"
          :label="ruleCard.name"
          :rules="formData.nameDetail.validation"
        />
        <v-text-field
          v-if="formData.points"
          v-model="formData.points.value"
          label="Points paid"
          :rules="formData.points.validation"
          type="number"
        />
        <v-text-field
          v-if="formData.upkeep"
          v-model="formData.upkeep.value"
          label="Monthly upkeep"
          :rules="formData.upkeep.validation"
          type="number"
        />
        <v-text-field
          v-if="formData.cashPaid"
          v-model="formData.cashPaid.value"
          label="Coppers paid"
          :rules="formData.cashPaid.validation"
          type="number"
        />
        <v-text-field
          v-if="formData.counters"
          v-model="formData.counters.value"
          label="Counters"
          :rules="formData.counters.validation"
          type="number"
        />
        <v-switch
          v-if="formData.dormant"
          v-model="formData.dormant.value"
          label="Add as dormant"
          :rules="formData.dormant.validation"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { RuleCard } from "@/types";
import {
  getFormData,
  CustomCardData,
  CustomField,
  dataDefault
} from "@/heimr/rule-card-customize";

type FormFields = {
  [propName: string]:
    | undefined
    | (CustomField & {
        value: string | number | boolean;
        rules: Function[];
      });
};

const required = (val?: string | number) => {
  let error = false;
  if (
    (typeof val === "string" && val.trim() === "") ||
    val === undefined ||
    val === 0
  ) {
    error = true;
  }
  return error && "Field must be filled out";
};

function setValue(formData: CustomCardData, requiredOnly = false): FormFields {
  return Object.entries(formData).reduce(
    (formData: FormFields, [fieldName, setting]) => {
      const requiredNoPreset =
        !setting || (setting.required && typeof setting.preset === "undefined");

      if (setting && (!requiredOnly || requiredNoPreset)) {
        formData[fieldName] = {
          value: setting.preset,
          validation: setting.required ? [required] : [],
          ...setting
        };
      } else {
        formData[fieldName] = undefined;
      }
      return formData;
    },
    {}
  );
}

export default Vue.extend({
  name: "RuleCardForm",
  props: {
    ruleCard: {
      type: Object,
      required: true
    },
    requiredOnly: {
      type: Boolean
    }
  },

  data(): { formData: CustomCardData } {
    const formData = setValue(getFormData(this.ruleCard), this.requiredOnly);
    return { formData };
  },

  watch: {
    ruleCard(ruleCard: RuleCard) {
      this.reset(ruleCard);
    }
  },

  methods: {
    reset(ruleCard?: RuleCard) {
      this.form.resetValidation();
      this.formData = setValue(
        getFormData(ruleCard || this.ruleCard),
        this.requiredOnly
      );
    },

    save() {
      if (!this.form.validate()) {
        return;
      }

      const saveData: { [propName: string]: number | string | boolean } = {};
      Object.entries(this.formData).forEach(([name, data]) => {
        if (!data) {
          return;
        }
        let value = data.value;
        if (typeof data.preset === "number") {
          value = parseInt(value);
        }
        if (value !== data.preset) {
          saveData[name] = value;
        }
      });
      this.$emit("save", saveData);
    },
    cancel() {
      this.$emit("cancel");
    }
  },

  computed: {
    form(): Vue & { validate: () => boolean; resetValidation: () => void } {
      // Work around for $refs.form not having a validate method
      return this.$refs.form as Vue & {
        validate: () => boolean;
        resetValidation: () => void;
      };
    }
  }
});
</script>
