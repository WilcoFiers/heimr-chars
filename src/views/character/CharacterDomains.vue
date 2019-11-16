<template>
  <v-container>
    <v-row>
      <h1>{{ name }}'s Domains</h1>
      <v-spacer />
      <v-btn :to="resources()">Current Resources</v-btn>
    </v-row>
    <v-row>
      <DomainSelection />
    </v-row>

    <v-row class="px-5">
      <v-btn :to="back()">
        <v-icon>mdi-arrow-left</v-icon>Name &amp; Race
      </v-btn>
      <v-spacer />
      <v-btn type="submit" class="primary">
        Next: Items &amp; Money
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DomainSelection from "@/components/DomainSelection.vue";

export default Vue.extend({
  name: "CharacterDomains",
  components: { DomainSelection },
  data() {
    return {
      name: "Henk"
    };
  },
  methods: {
    resources() {
      const { charId } = this.$route.params;
      return `/characters/${charId}/resources`;
    },
    back() {
      const { charId } = this.$route.params;
      return `/characters/${charId}`;
    }
  }
});
</script>
