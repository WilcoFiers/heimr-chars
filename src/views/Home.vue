<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          Heimr LARP
          <span class="font-weight-light no-wrap">Unofficial App</span>
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8" xl="6" v-for="(link, i) in links" :key="i">
        <v-card :to="link.route" height="100%">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="underline" v-text="link.title" />
              <v-card-subtitle v-text="link.subtitle" />
            </div>
            <v-avatar class="ma-4" size="50" tile>
              <IconImage :asset="link.image" />
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import IconImage from "@/components/IconImage.vue";

const links = [
  {
    route: "/characters",
    title: "My Characters",
    subtitle: "Create and manage your Heimr characters.",
    image: "characters"
  },
  {
    route: { name: "GamesTools" },
    title: "Games & Tools",
    subtitle: "Try out mini games and tools for Heimr domains.",
    image: "games"
  },
  {
    route: "/books/core-rules",
    title: "Core LARP Rules",
    subtitle: "Minimal rules that all players should know.",
    image: "book"
  }
];

export default Vue.extend({
  name: "Home",
  components: { IconImage },
  data() {
    return { links };
  }
});
</script>
