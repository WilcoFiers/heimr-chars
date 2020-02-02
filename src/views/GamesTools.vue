<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Heimr Games And Tools</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8" xl="6" v-for="tool in tools" :key="tool.name">
        <v-card :to="tool.route" height="100%">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="underline" v-text="tool.title" />
              <v-card-subtitle v-text="tool.subtitle" />
            </div>
            <v-avatar class="ma-4" size="50" tile>
              <IconImage :asset="tool.image" />
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

const tools = [
  {
    title: "Complication Deck",
    subtitle: `The first priority in dealing with combat injuries is to stabilize the patient. Players with the Surgery skill draw cards from this deck.`,
    route: { name: "ComplicationDeck" },
    image: "domains/battlefield-surgery"
  },
  {
    title: "Automata crafting",
    subtitle: `Create magic spells, known in Heimr as "automata" using the glyph language from the Primordial magic domain.`,
    route: { name: "AutomataList" },
    image: "auto-repair"
  }
];

export default Vue.extend({
  name: "GamesTools",
  components: { IconImage },
  data() {
    return { tools };
  }
});
</script>

<style scoped>
.v-card--link:hover:before {
  opacity: 0.08;
}
</style>
