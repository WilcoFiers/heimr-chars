<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between pb-1">
          <h1 class="headline">Select Character Domains</h1>
          <CreationGuideBtn />
        </div>
        <p>
          A domain is a collection of skills, items, conditions. Every domain
          has its own theme and challenges players in a different way. You can
          choose skills from as many domains as you like. We recommend using 1
          to 3 domains for a character. Detailed information of the domains are
          in the
          <router-link to="/books/domains">Heimr Domains</router-link>
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="domain in domains"
        :key="domain.domainName"
      >
        <v-card
          height="100%"
          @click="toggle(domain)"
          :class="{
            activeCard: selected[domain.domainName],
            lockedCard: locked[domain.domainName]
          }"
        >
          <v-card-title>
            <h3 class="d-flex flex-row-reverse">
              {{ domain.domainName }}
              <IconImage :asset="domainImg(domain)" width="28" />
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
import CreationGuideBtn from "@/components/character/CreationGuideBtn.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import IconImage from "@/components/IconImage.vue";

type ActiveDomain = { [propName: string]: boolean };

export default Vue.extend({
  name: "CharacterStepDomains",
  data() {
    return { domains: domainsMeta, message: "" };
  },
  components: { CreationGuideBtn, ErrorMessage, IconImage },

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
    }
  },

  methods: {
    domainImg,
    toggle({ domainName }: DomainMeta) {
      if (!this.locked[domainName]) {
        this.message = "";
        this.$store.commit("toggleSelectedDomain", domainName);
      }
    },

    save(): boolean {
      const { selectedDomains } = this.charState;
      const isValid =
        selectedDomains.length + Object.keys(this.locked).length > 0;
      this.message = isValid ? "" : "You must select at least 1 domain";
      return isValid;
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

.check {
  margin-right: -28px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  height: 28px;
  width: 28px;
}

.activeCard,
.lockedCard {
  background: #e6f4d7;
}
</style>
