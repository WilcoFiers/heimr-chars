<template>
  <div class="mt-3">
    <p class="d-sm-none text-center" v-if="canOwnMultiple">
      Currently owned: {{ owned }}
    </p>

    <div class="d-flex justify-space-between">
      <OptionsBtn
        outlined
        @click="cardAction('addRule')"
        v-if="!ownsOtherLevel"
        :disabled="!canAdd"
      >
        <template #default> <v-icon left>mdi-plus</v-icon>Add </template>
        <template #menu>
          <v-list class="py-1">
            <v-list-item
              v-if="allowDormant"
              @click="cardAction('addDormantSkill')"
              >Add as dormant skill</v-list-item
            >
            <v-list-item @click="cardAction('addRuleCustom')"
              >Add with changes</v-list-item
            >
          </v-list>
        </template>
      </OptionsBtn>
      <v-btn
        outlined
        v-else
        :disabled="!canChangeLevel"
        @click="cardAction('changeRuleLevel')"
      >
        <v-icon left>mdi-swap-vertical</v-icon>Change level
      </v-btn>

      <span v-if="canOwnMultiple" class="pt-2 d-none d-sm-inline"
        >Currently owned: {{ owned }}</span
      >

      <v-btn
        outlined
        v-if="canRemove || canOwnMultiple"
        :disabled="!canRemove"
        @click="cardAction('removeRule')"
      >
        <v-icon left>mdi-minus</v-icon>remove
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RuleCardRestrictions } from "@/heimr/validateCardActions";
import OptionsBtn from "@/components/shared/OptionsBtn.vue";

export default Vue.extend({
  name: "RuleCardBtnBar",
  components: { OptionsBtn },
  props: {
    restrictions: Object,
    ruleCard: Object,
    allowDormant: Boolean
  },
  computed: {
    owned(): number {
      return this.restrictions.owned;
    },
    ownsOtherLevel(): number {
      return this.restrictions.ownsOtherLevel;
    },
    canOwnMultiple(): boolean {
      return this.restrictions.canOwnMultiple;
    },
    canAdd(): boolean {
      return (this.restrictions as RuleCardRestrictions).add.length === 0;
    },
    canRemove(): boolean {
      return (this.restrictions as RuleCardRestrictions).remove.length === 0;
    },
    canChangeLevel(): boolean {
      return (
        (this.restrictions as RuleCardRestrictions).levelChange.length === 0
      );
    }
  },
  methods: {
    cardAction(event: string) {
      this.$emit("cardAction", event);
    }
  }
});
</script>
