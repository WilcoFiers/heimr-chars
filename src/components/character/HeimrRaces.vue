<template>
  <v-container>
    <v-row class="justify-center">
      <v-col :cols="3">
        <v-card>
          <h2 class="pl-3 pt-2">Races</h2>
          <v-list height="250" class="overflow-auto">
            <v-list-item-group v-model="item">
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
            <h2>{{ currentRace.name }}</h2>
            <v-spacer />
            <a
              target="blank"
              :href="
                'http://heimr.nl/in_character/lore/' + loreName(currentRace)
              "
              :title="'Heimr lore for ' + loreName(currentRace)"
              >lore</a
            >
          </v-card-title>
          <v-card-text>
            <p>
              <strong>Hitpoints:</strong>
              {{ currentRace.hitpoints }} /
              <strong>Willpower:</strong>
              {{ currentRace.willpower }}
            </p>
            <div v-if="currentRace.uniqueRules">
              <h3>Unique rules</h3>
              <ul>
                <li v-for="(rule, i) in currentRace.uniqueRules" :key="i">
                  {{ rule }}
                </li>
              </ul>
            </div>
            <div v-if="currentRace.sharedRules" class="mt-2">
              <h3>Shared rules</h3>
              <ul>
                <li v-for="(rule, i) in currentRace.sharedRules" :key="i">
                  {{ rule }}
                </li>
              </ul>
            </div>
            <div v-if="currentRace.downtimeRules" class="mt-2">
              <h3>Downtime rules</h3>
              <ul>
                <li v-for="(rule, i) in currentRace.downtimeRules" :key="i">
                  {{ rule }}
                </li>
              </ul>
            </div>
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

const races = heimrData.races as Race[];

export default Vue.extend({
  name: "HeimrRaces",
  props: {
    value: {
      type: String
    }
  },
  data(): { raceIndex: number; item: number; selected: number; races: Race[] } {
    return { raceIndex: 0, item: 0, selected: -1, races };
  },
  computed: {
    currentRace(): Race {
      return this.races[this.raceIndex] || {};
    }
  },
  methods: {
    updateCard(index: number) {
      this.raceIndex = index;
    },
    selectRace() {
      this.selected = this.raceIndex;
      const { name } = this.races[this.raceIndex];
      this.$emit("input", name);
    },
    loreName({ name }: Race) {
      return name.split(" ")[0].toLowerCase();
    }
  }
});
</script>
