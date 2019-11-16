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
            v-model="name"
            :rules="[required]"
          />
        </v-col>

        <v-col :cols="2">
          <v-dialog v-if="!isNew" v-model="dialog" max-width="290">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on"> <v-icon left>mdi-delete</v-icon>Delete </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Delete {{ name }}</v-card-title>
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

      <HeimrRaces v-model="race" />
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

export default Vue.extend({
  name: "CharacterOverview",
  props: {
    charId: {
      type: String
    }
  },
  components: { HeimrRaces, ErrorMessage },
  data() {
    return {
      name: "",
      race: "",
      message: "",
      uid: "",
      dialog: false,
      required: (val: string) => val !== "" || "Field must be filled out"
    };
  },

  created() {
    const { characters } = this.$store.state;
    const char = characters.find(
      ({ id }: { id: string }) => id === this.charId
    );

    if (char) {
      this.name = char.name;
      this.race = char.race;
      this.uid = char.id;
    }
  },

  methods: {
    // TODO: have data processing handled by the the view, not the component
    // TODO: Pass in the character props, don't rely on looking them up
    async saveCharacter() {
      const { name, race, uid } = this;
      this.message = race ? "" : "Please select a race";
      if (!this.form.validate() || !race) {
        return;
      }
      if (uid) {
        await this.$store.dispatch("updateCharacter", { name, race, uid });
      } else {
        await this.$store.dispatch("createCharacter", { name, race });
      }
      // TODO: Don't await, in offline mode the promise won't resolve!!
      this.$router.push(`/characters/${uid}/domains`);
    },

    async archiveChar() {
      await this.$store.dispatch("archiveCharacter", { uid: this.uid });
      this.$router.push("/characters");
    },

    back() {
      this.$router.push("/characters");
    }
  },

  computed: {
    isNew(): boolean {
      return !this.charId;
    },

    form(): Vue & { validate: () => boolean } {
      // Work around for $refs.form not having a validate method
      return this.$refs.form as Vue & { validate: () => boolean };
    }
  }
});
</script>
