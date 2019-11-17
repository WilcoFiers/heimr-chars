<template>
  <v-form @submit.prevent="saveCharacter" ref="form">
    <v-container>
      <v-row>
        <v-col :cols="3">
          <v-img
            :src="require('../../assets/auto-repair.png')"
            contain
            width="120"
            class="black ml-3"
          ></v-img>
        </v-col>

        <v-col :cols="7">
          <h1 v-if="isNew">New Characters</h1>
          <h1 v-else>Update Characters</h1>
          <v-text-field
            label="Character name"
            v-model="character.name"
            :rules="[required]"
          />
        </v-col>

        <v-col :cols="2">
          <v-dialog v-if="!isNew" v-model="dialog" max-width="290">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on"> <v-icon left>mdi-delete</v-icon>Delete </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline"
                >Delete {{ character.name }}</v-card-title
              >
              <v-card-text
                >Are you sure you want to delete this character?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false"
                  >Cancel</v-btn
                >
                <v-btn color="red darken-1" text @click="archiveChar"
                  >Delete</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>

      <HeimrRaces v-model="character.race" />
      <div class="text-center">
        <!-- Should probably inside of HeimrRaces -->
        <ErrorMessage :message="message" />
      </div>

      <v-row class="px-5">
        <v-btn @click="back">
          <v-icon>mdi-arrow-left</v-icon>My Characters
        </v-btn>

        <v-spacer />

        <v-btn type="submit" class="primary">
          Next: Skills &amp; Conditions
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { RootState } from "@/store/types";
import HeimrRaces from "./HeimrRaces.vue";
import ErrorMessage from "../ErrorMessage.vue";

export type CharacterMeta = {
  name: string;
  race?: string;
};

export default Vue.extend({
  name: "CharacterOverview",
  components: { HeimrRaces, ErrorMessage },

  props: {
    updateCharacter: {
      type: Object
    }
  },

  data() {
    const newCharacter: CharacterMeta = { name: "" };
    return {
      message: "",
      uid: "",
      dialog: false,
      newCharacter,
      required: (val: string) => val !== "" || "Field must be filled out"
    };
  },

  methods: {
    async saveCharacter() {
      const { name, race } = this.character;
      this.message = race ? "" : "Please select a race";
      if (!this.form.validate() || !race) {
        return;
      }
      this.$emit("save", { name, race });
    },

    archiveChar() {
      this.$emit("archive");
    },

    back() {
      this.$router.push("/characters");
    }
  },

  computed: {
    character(): CharacterMeta {
      return this.updateCharacter || this.newCharacter;
    },

    isNew(): boolean {
      return !this.updateCharacter;
    },

    form(): Vue & { validate: () => boolean } {
      // Work around for $refs.form not having a validate method
      return this.$refs.form as Vue & { validate: () => boolean };
    }
  }
});
</script>
