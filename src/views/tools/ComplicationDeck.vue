<template>
  <v-container>
    <SingleCol>
      <h1>Complication Deck</h1>
    </SingleCol>

    <v-row>
      <v-col cols="12" class="d-md-none">
        <v-card>
          <v-card-text>
            <v-select
              v-model="surgeryLevel"
              label="Surgery level"
              :items="surgeryItems"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card v-if="cards.length === 0">
          <v-card-title>Instructions</v-card-title>
          <v-card-text>
            The first priority in dealing with combat injuries is to
            <em>stabilize</em> the patient. This requires the
            <em>surgery</em> skill. The surgion draws a card from the
            <em>complication deck</em>, the complidation determine whether the
            patient stabalizes, needs further surgery, or dies.
          </v-card-text>
        </v-card>
        <v-expansion-panels v-else v-model="expanded">
          <v-expansion-panel v-for="(card, i) in replacedCards" :key="i">
            <v-expansion-panel-header class="subtitle-1 bold font-weight-bold"
              >Card {{ i + 1 }}: {{ card.name }}</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <RuleCardContent :ruleCard="card" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-col class="px-0 d-flex justify-space-between">
          <v-btn class="primary" @click="drawCard">Draw a card</v-btn>
          <v-btn @click="resetCards" :disabled="cards.length < 1">Reset</v-btn>
        </v-col>
      </v-col>
      <v-col md="3" class="d-none d-md-block">
        <v-card class>
          <v-card-title class="subtitle-1">Surgery level</v-card-title>
          <v-card-text>
            <v-radio-group v-model="surgeryLevel" class="mt-0">
              <v-radio label="Surgery 1" :value="1"></v-radio>
              <v-radio label="Surgery 2" :value="2"></v-radio>
              <v-radio label="Surgery 3" :value="3"></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import SingleCol from "@/components/shared/SingleCol.vue";
import RuleCardContent from "@/components/domain/RuleCardContent.vue";
import { ComplicationCard } from "@/types";
import { complicationCards } from "@/heimr-data";

// Should add up to 100, but we're just making sure:
const complicationTotal = complicationCards.reduce(
  (total, { drawChance }) => total + drawChance,
  0
);

function randomComplication(): ComplicationCard {
  const cardNum = Math.floor(Math.random() * complicationTotal);
  let count = 0;
  for (let complication of complicationCards) {
    count += complication.drawChance;

    const { name, drawChance, replaceLevel, replaceCard } = complication;
    if (count >= cardNum) {
      return complication;
    }
  }
  return complicationCards[complicationCards.length - 1];
}

export default Vue.extend({
  name: "ComplicationDeck",
  components: { SingleCol, RuleCardContent },
  data() {
    return {
      cards: [] as ComplicationCard[],
      expanded: undefined as undefined | number,
      surgeryLevel: 1,
      surgeryItems: [
        { text: "Surgery 1", value: 1 },
        { text: "Surgery 2", value: 2 },
        { text: "Surgery 3", value: 3 }
      ]
    };
  },

  computed: {
    replacedCards(): ComplicationCard[] {
      return this.cards.map(card => {
        let replaceCard: ComplicationCard | undefined = card;
        if (card.replaceLevel === 2 && this.surgeryLevel >= 2) {
          replaceCard = complicationCards.find(({ name }) => {
            return (
              name.toLowerCase() === (card.replaceCard || "").toLowerCase()
            );
          });
        }
        if (replaceCard?.replaceLevel === 3 && this.surgeryLevel === 3) {
          replaceCard = complicationCards.find(({ name }) => {
            return (
              name.toLowerCase() ===
              (replaceCard?.replaceCard || "").toLowerCase()
            );
          });
        }
        return replaceCard || card;
      });
    }
  },

  methods: {
    drawCard() {
      this.cards.push(randomComplication());
      this.expanded = this.cards.length - 1;
    },

    resetCards() {
      this.cards = [];
      this.expanded = undefined;
    }
  }
});
</script>
