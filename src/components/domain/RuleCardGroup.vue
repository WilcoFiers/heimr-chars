<template>
  <div>
    <v-row class="flex-row-reverse">
      <v-col class="py-0" v-if="multiple" :cols="3">
        <v-list class="py-0">
          <v-list-item-group v-model="level" color="primary" mandatory>
            <v-list-item
              v-for="(ruleCard, i) in ruleCardGroup.ruleCards"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title>
                  Level {{ i + 1 }}
                  <v-icon
                    v-if="ruleCard.restrictions.owned > 0"
                    small
                    color="blue"
                    >mdi-star</v-icon
                  >
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-avatar v-if="ruleCard.points"
                >{{ ruleCard.points }}pts</v-list-item-avatar
              >
              <v-list-item-avatar v-else-if="ruleCard.marketPrice"
                >{{ ruleCard.marketPrice }} ¢</v-list-item-avatar
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>

      <v-col class="pt-0">
        <RuleCardContent :ruleCard="ruleCard" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <slot
          name="cardActions"
          :ruleCard="ruleCard"
          :restrictions="restrictions"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RuleCardContent from "./RuleCardContent.vue";
import { RuleCard } from "@/types";
import { RuleCardRestrictions } from "@/heimr/validateCardActions";

export default Vue.extend({
  name: "RuleCardGroup",
  components: { RuleCardContent },
  props: {
    ruleCardGroup: {
      type: Object
    }
  },

  data() {
    return {
      level: 0
    };
  },

  computed: {
    multiple(): boolean {
      return this.ruleCardGroup.ruleCards.length > 1;
    },
    ruleCard(): RuleCard {
      const { ruleCard } = this.ruleCardGroup.ruleCards[this.level];
      return ruleCard;
    },
    restrictions(): RuleCardRestrictions {
      const { restrictions } = this.ruleCardGroup.ruleCards[this.level];
      return restrictions;
    }
  },

  methods: {
    cardAction(action: string) {
      this.$emit("cardAction", { action, ruleCard: this.ruleCard });
    }
  }
});
</script>
