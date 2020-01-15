<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Unofficial Heimr App</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9" v-for="link in links" :key="link.to">
        <v-card :to="link.to" height="100%">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title v-text="link.title" />
              <v-card-subtitle v-text="link.subtitle" />
            </div>
            <v-avatar class="ma-4" size="60" tile>
              <!-- <v-img :src="domainImg(domain)" class="image" /> -->
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Home",
  data() {
    return {
      links: [
        {
          to: "/characters",
          title: "My Characters",
          subtitle: "Create and manage your Heimr characters.",
          avatar: ""
        },
        {
          to: { name: "GamesTools" },
          title: "Heimr Games & Tools",
          subtitle: "Try out mini games and tools for Heimr domains.",
          avatar: ""
        },
        {
          to: "/books/core-rules",
          title: "Heimr LARP: Core Rules",
          subtitle: "Minimal rules that all players should know.",
          avatar: ""
        }
      ]
    };
  }
});
</script>
