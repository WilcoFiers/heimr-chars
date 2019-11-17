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
            <RuleCardTitle :card="currentRace" />
          </v-card-title>
          <v-card-text>
            <RuleCardContent :card="currentRace" />
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
import heimrData from "@/assets/heimr-data.json";
import { Race } from "@/types";
import RuleCardContent from "@/components/domain/RuleCardContent.vue";
import RuleCardTitle from "@/components/domain/RuleCardTitle.vue";

const races = heimrData.races as Race[];

export default Vue.extend({
  name: "HeimrRaces",
  components: { RuleCardTitle, RuleCardContent },
  props: {
    value: {
      type: String
    }
  },

  data(): {
    listgroupModel: number;
    activeItem: number;
    selected: number;
    races: Race[];
  } {
    const selected = races.findIndex(race => race.name == this.value);
    const activeItem = selected !== -1 ? selected : 0;
    return {
      activeItem,
      listgroupModel: activeItem,
      selected,
      races
    };
  },

  computed: {
    currentRace(): Race {
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
