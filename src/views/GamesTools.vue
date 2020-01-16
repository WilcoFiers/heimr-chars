<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Heimr Games And Tools</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" xl="4" v-for="tool in tools" :key="tool.name">
        <v-card :to="tool.route" height="100%">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="link" v-text="tool.name" />
              <v-card-subtitle v-text="tool.description" />
            </div>
            <v-avatar class="ma-4" size="60" tile>
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

export default Vue.extend({
  name: "GamesTools",
  components: { IconImage },
  data() {
    return {
      tools: [
        {
          name: "Automata crafting",
          description: `Create magic spells, known in Heimr as "automata" using the glyph language from the Primordial magic domain.`,
          route: { name: "AutomataList" },
          image: "auto-repair"
        }
      ]
    };
  }
});
</script>

<style scoped>
.link {
  text-decoration: underline;
  text-decoration-color: rgba(0, 0, 0, 0.35);
}
.v-card--link:hover:before {
  opacity: 0.08;
}
</style>
