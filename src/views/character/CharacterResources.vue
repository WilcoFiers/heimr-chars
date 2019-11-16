<template>
  <v-container>
    <v-row>
      <h1>{{ name }}'s Skills &amp; Conditions</h1>
      <v-spacer />
      <v-btn :to="domains()">Domains</v-btn>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <v-card>
          <v-card-title>
            <h2>Skills</h2>
            <v-spacer />
            <span>X / 20 Resources</span>
          </v-card-title>
          <v-card-text>
            <v-expansion-panels multiple>
              <v-expansion-panel v-for="(item, i) in 5" :key="i">
                <v-expansion-panel-header
                  >Skill {{ item }}</v-expansion-panel-header
                >
                <v-expansion-panel-content
                  >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo
                  consequat.</v-expansion-panel-content
                >
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="6">
        <v-card>
          <v-card-title>
            <h2>Conditions</h2>
          </v-card-title>
          <v-card-text>
            <v-expansion-panels multiple>
              <v-expansion-panel v-for="(item, i) in 5" :key="i">
                <v-expansion-panel-header
                  >Condition {{ item }}</v-expansion-panel-header
                >
                <v-expansion-panel-content
                  >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo
                  consequat.</v-expansion-panel-content
                >
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CharacterResources",
  data() {
    return {
      name: "Henk"
    };
  },
  methods: {
    back() {
      const { charId } = this.$route.params;
      this.$router.push(`/characters/${charId}`);
    },
    // This can probably be done much better
    domains() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/domains`;
    }
  }
});
</script>
