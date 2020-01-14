<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>My Automata</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9">
        <v-card>
          <v-list>
            <v-list-item @click="createModal = true">
              <v-list-item-action>
                <v-icon>mdi-plus</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>Create a new Automata</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-for="automata in myAutomata"
              :key="automata.id"
              :to="{
                name: 'AutomataEditor',
                params: { automataId: automata.id }
              }"
            >
              <v-list-item-action>
                <v-checkbox
                  :aria-label="`select ${automata.title}`"
                  @click.prevent
                  disabled
                />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="automata.title" />
                <v-list-item-subtitle
                  >{{ automata.width }} by {{ automata.height }} grid. Last
                  updated:
                  {{ toDate(automata.lastUpdated) }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="createModal" max-width="450">
      <v-card>
        <v-card-title>Automata size</v-card-title>
        <v-card-text>
          <v-radio-group v-model="paperSize">
            <v-radio label="Standard paper (8 by 10)" value="default" />
            <v-radio label="Large canvas (10 by 16)" value="large" />
            <v-radio label="Other size" value="custom" />
          </v-radio-group>
          <div v-if="paperSize === 'custom'" class="d-flex">
            <v-text-field
              type="number"
              label="Paper Width"
              v-model="customWidth"
              class="mr-3"
            />
            <v-text-field
              type="number"
              label="Paper Height"
              v-model="customHeight"
              class="ml-3"
            />
          </div>
          <ErrorMessage :message="message" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="resetModal">Cancel</v-btn>
          <v-spacer />
          <v-btn class="primary" @click="newAutomata" :loading="isCreating"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { State } from "@/types";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default Vue.extend({
  name: "AutomataList",
  components: { ErrorMessage },
  created() {
    this.$store.dispatch("bindMyAutomata");
  },

  data() {
    return {
      message: "",
      createModal: false as Boolean,
      paperSize: "default" as "default" | "large" | "custom",
      customWidth: 5 as number,
      customHeight: 5 as number,
      isCreating: false as boolean
    };
  },

  computed: {
    myAutomata() {
      const state = this.$store.state as State;
      return state.automata.myAutomata;
    }
  },

  methods: {
    resetModal() {
      this.message = "";
      this.customWidth = 5;
      this.customHeight = 5;
      this.paperSize = "default";
      this.createModal = false;
    },

    async newAutomata() {
      let paperSize: { width: number; height: number };
      if (this.paperSize === "default") {
        paperSize = { width: 8, height: 10 };
      } else if (this.paperSize === "large") {
        paperSize = { width: 10, height: 16 };
      } else {
        paperSize = { width: this.customWidth, height: this.customHeight };
      }
      this.isCreating = true;
      try {
        const automataId = await this.$store.dispatch(
          "createAutomata",
          paperSize
        );
        this.$router.push({ name: "AutomataEditor", params: { automataId } });
      } catch (e) {
        this.message = e.message;
      } finally {
        this.isCreating = false;
      }
    },

    toDate({ seconds }: { seconds: number }) {
      const date = new Date(seconds * 1000);
      const year = date.getFullYear();
      const month = 1 + date.getMonth();
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${year}/${month}/${day}, ${hours}:${minutes}`;
    }
  }
});
</script>
