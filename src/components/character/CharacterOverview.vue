<template>
  <v-form @submit.prevent="saveCharacter" ref="form">
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-img
            :src="raceImg(character.race)"
            contain
            width="120"
            class="black ml-3"
          ></v-img>
        </v-col>

        <v-col cols="6">
          <h1 v-if="isNew">New Characters</h1>
          <h1 v-else>Update Characters</h1>
          <v-text-field
            label="Character name"
            v-model="character.name"
            :rules="[required]"
          />
        </v-col>

        <v-col cols="3" class="text-right" v-if="!isNew">
          <ResourceMini
            :rules="rules"
            :money="500"
            :resources="20"
            :to="`/characters/${character.id}/resources`"
          />
          <ArchiveCharacterBtn
            btnClass="mt-5"
            :name="character.name"
            @archive="archiveChar()"
          />
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
import { raceImg } from "@/heimr-data";
import HeimrRaces from "./HeimrRaces.vue";
import ResourceMini from "./ResourceMini.vue";
import ArchiveCharacterBtn from "./ArchiveCharacterBtn.vue";
import ErrorMessage from "../ErrorMessage.vue";

export type CharacterMeta = {
  name: string;
  race?: string;
};

export default Vue.extend({
  name: "CharacterOverview",
  components: { HeimrRaces, ResourceMini, ArchiveCharacterBtn, ErrorMessage },

  props: {
    updateCharacter: {
      type: Object
    },
    rules: {
      type: Array
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
    raceImg,

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
