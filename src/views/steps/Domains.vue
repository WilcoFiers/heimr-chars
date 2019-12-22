<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Select Character Domains</h1>
        <p>
          A domain is a collection of skills, items, conditions. Every domain
          has its own theme and challenges players in a different way. You can
          choose skills from as many domains as you like. We recommend using 1
          to 3 domains for a character. Detailed information of the domains are
          in the
          <a href="http://heimr.nl/game_rules">Heimr Rulebook</a>.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" v-for="domain in domains" :key="domain.domainName">
        <v-card
          height="100%"
          @click="toggle(domain)"
          :class="{
            activeCard: selected[domain.domainName],
            lockedCard: locked[domain.domainName]
          }"
        >
          <v-card-title>
            <h3 class="title d-flex flex-row-reverse">
              {{ domain.domainName }}
              <v-img
                :src="domainImg(domain)"
                class="image"
                width="28"
                height="28"
              />
              <v-icon
                v-if="locked[domain.domainName]"
                class="check"
                aria-label="selected"
                >mdi-star</v-icon
              >
              <v-icon
                v-else-if="selected[domain.domainName]"
                class="check"
                aria-label="selected"
                >mdi-check-bold</v-icon
              >
            </h3>
            <v-spacer />
            <span class="body-2 grey--text text--darken-2">
              Complexity:
              <v-icon
                v-for="(x, i) in Array(domain.complexity).fill('x')"
                :key="i + x"
                small
                class="star grey--text"
                >mdi-star</v-icon
              >
            </span>
          </v-card-title>
          <v-card-text>{{ domain.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ErrorMessage :message="message" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { State } from "@/store";
import { domainsMeta, domainImg, DomainMeta } from "@/heimr-data";
import { CharacterState } from "@/store/character";
import ErrorMessage from "@/components/ErrorMessage.vue";

type ActiveDomain = { [propName: string]: boolean };

export default Vue.extend({
  name: "CharacterStepDomains",
  data() {
    return { domains: domainsMeta, message: "" };
  },
  components: { ErrorMessage },

  computed: {
    charState(): CharacterState {
      return (this.$store.state as State).character;
    },

    locked(): ActiveDomain {
      const locked: ActiveDomain = {};
      const { rules = [] } = this.charState;
      rules.forEach(({ domainName }) => (locked[domainName] = true));
      return locked;
    },

    selected(): ActiveDomain {
      const { selectedDomains } = this.charState;
      const selected: ActiveDomain = {};
      domainsMeta.forEach(({ domainName }) => {
        selected[domainName] = selectedDomains.includes(domainName);
      });
      return selected;
    },

    valid(): boolean {
      const { selectedDomains } = this.charState;
      return selectedDomains.length > 0 || Object.keys(this.locked).length > 0;
    }
  },

  methods: {
    domainImg,
    toggle({ domainName }: DomainMeta) {
      if (this.locked[domainName]) {
        return;
      }
      const { selectedDomains } = this.charState;
      const index = selectedDomains.indexOf(domainName);
      if (index === -1) {
        selectedDomains.push(domainName);
      } else {
        selectedDomains.splice(index, 1);
      }
    }
  }
});
</script>

<style scoped>
.star {
  margin-right: -3px;
}
.image,
.check {
  border-radius: 5px;
  margin-right: 10px;
  color: white;
}
.image {
  background: black;
}

.check {
  margin-right: -28px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  height: 28px;
  width: 28px;
}

.activeCard,
.lockedCard {
  background: #d2e7f9;
}
</style>
