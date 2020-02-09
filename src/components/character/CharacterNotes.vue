<template>
  <v-card>
    <v-card-title>
      <h2 class="title">Character Notes</h2>
    </v-card-title>
    <v-card-text>
      <v-text-field
        label="Short bio (public)"
        :value="shortBio"
        @blur="updateField('shortBio', $event.target.value)"
      />
      <v-textarea
        label="Full bio (hidden)"
        :value="fullBio"
        @blur="updateField('fullBio', $event.target.value)"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "CharacterNotes",
  props: {
    fullBio: String,
    shortBio: String
  },
  methods: {
    updateField(fieldName: "fullBio" | "shortBio", value: string) {
      if (this[fieldName] !== value) {
        this.$emit("save", { fieldName, value });
      }
    }
  }
});
</script>
