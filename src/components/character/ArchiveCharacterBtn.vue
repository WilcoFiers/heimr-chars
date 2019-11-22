<template>
  <v-dialog v-model="dialog" max-width="290">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" :class="btnClass">
        <v-icon left>mdi-delete</v-icon>Delete
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Delete {{ name }}</v-card-title>
      <v-card-text>Are you sure you want to delete this character?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false"
          >Cancel</v-btn
        >
        <v-btn color="red darken-1" text @click="archive">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ArchiveCharacterBtn",

  props: {
    name: {
      type: String
    },
    btnClass: {
      type: String
    }
  },
  data() {
    return { dialog: false };
  },
  methods: {
    archive() {
      this.$emit("archive");
    }
  }
});
</script>
