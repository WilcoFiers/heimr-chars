<template>
  <v-navigation-drawer app clipped color="grey lighten-4">
    <v-list dense class="grey lighten-4">
      <template v-for="(item, i) in items">
        <v-layout v-if="item.heading" :key="i" row align-center>
          <v-flex xs6>
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-flex>
          <v-flex xs6 class="text-xs-right">
            <v-btn small text>edit</v-btn>
          </v-flex>
        </v-layout>
        <v-divider
          v-else-if="item.divider"
          :key="i"
          dark
          class="my-3"
        ></v-divider>
        <v-list-item v-else :key="i" @click="noop">
          <v-list-item-action>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      items: [
        { icon: "account-search", text: "Characters" },
        { icon: "calendar-month", text: "Events" },
        { icon: "card-bulleted", text: "Profile" },
        { divider: true },
        { icon: "settings", text: "Settings" },
        { icon: "help", text: "Help" }
      ]
    };
  },
  methods: {
    noop: () => {}
  }
});
</script>
