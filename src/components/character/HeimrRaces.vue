<template>
  <v-container>
    <v-row class="justify-center">
      <v-col :cols="3">
        <v-card>
          <h2 class="pl-3 pt-2">Races</h2>
          <v-list height="250" class="overflow-auto">
            <v-list-item-group v-model="activeItem">
              <v-list-item
                v-for="(race, index) in races"
                :key="index"
                @click="updateCard(index)"
                :class="index === selected && 'primary lighten-4'"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ race.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action
                  v-if="index === selected"
                  aria-label="selected"
                >
                  <v-icon color="grey lighten-1">mdi-arrow-left-bold</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col :cols="9">
        <v-card>
          <v-card-title>
            <RuleCardTitle :ruleCard="currentRace" />
          </v-card-title>
          <v-card-text>
            <RuleCardContent :ruleCard="currentRace" />
          </v-card-text>
          <v-card-actions>
            <v-btn primary @click="selectRace">Select race</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { races } from "@/heimr-data";
import { RaceCard } from "@/types";
import RuleCardContent from "@/components/domain/RuleCardContent.vue";
import RuleCardTitle from "@/components/domain/RuleCardTitle.vue";

function findSelected(name: string): number {
  return races.findIndex(race => race.name == name);
}

export default Vue.extend({
  name: "HeimrRaces",
  components: { RuleCardTitle, RuleCardContent },
  props: {
    value: {
      type: String
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (typeof oldVal === "undefined") {
        const selected = findSelected(newVal);
        if (selected !== -1) {
          this.selected = selected;
          this.activeItem = selected;
          this.listgroupModel = selected;
        }
      }
    }
  },

  data(): {
    listgroupModel: number;
    activeItem: number;
    selected: number;
    races: RaceCard[];
  } {
    const selected = findSelected(this.value);
    const activeItem = selected !== -1 ? selected : 0;
    return { activeItem, selected, races, listgroupModel: activeItem };
  },

  computed: {
    currentRace(): RaceCard {
      return this.races[this.activeItem] || {};
    }
  },

  methods: {
    updateCard(index: number) {
      this.activeItem = index;
    },

    selectRace() {
      this.selected = this.activeItem;
      const { name } = this.races[this.selected];
      this.$emit("input", name);
    }
  }
});
</script>
