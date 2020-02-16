<template>
  <v-form @submit.prevent="save" ref="form">
    <v-container>
      <v-row class="flex-row-reverse">
        <v-col cols="12" sm="9">
          <div class="d-flex justify-space-between">
            <h1 v-if="isNew" class="headline">New Character</h1>
            <h1 v-else class="headline">Update Character</h1>
            <CreationGuideBtn :initialState="infoDialog" />
          </div>
          <v-text-field
            label="Character name"
            v-model="character.name"
            :rules="[required]"
          />
        </v-col>

        <v-col class="col-3 d-none d-sm-block">
          <IconImage :asset="raceImg(character.race)" class="ml-4" width="90" />
        </v-col>
      </v-row>

      <HeimrRaces v-model="character.race" />

      <div class="text-center">
        <!-- Should probably inside of HeimrRaces -->
        <ErrorMessage :message="message" />
      </div>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Character, CharacterRule, NewCharacter, State } from "@/types";
import { raceImg } from "@/heimr-data";

import CreationGuideBtn from "@/components/character/CreationGuideBtn.vue";
import HeimrRaces from "@/components/character/HeimrRaces.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import IconImage from "@/components/IconImage.vue";
import { randomBio } from "@/heimr/randomBio";

export default Vue.extend({
  name: "CharacterStepOrigins",
  components: { HeimrRaces, ErrorMessage, CreationGuideBtn, IconImage },
  data() {
    const newCharacter: Partial<Character> = { name: "" };
    const infoDialog = this.$route.params.charId === "new";
    return {
      message: "",
      uid: "",
      infoDialog,
      newCharacter,
      required: (val: string) => val !== "" || "Field must be filled out"
    };
  },

  computed: {
    character(): Partial<Character> {
      const { charProps } = (this.$store.state as State).character;
      return charProps || this.newCharacter;
    },

    rules(): CharacterRule[] {
      return (this.$store.state as State).character.rules || [];
    },

    isNew(): boolean {
      return this.$route.params.charId === "new";
    },

    form(): Vue & { validate: () => boolean } {
      // Work around for $refs.form not having a validate method
      return this.$refs.form as Vue & { validate: () => boolean };
    }
  },

  methods: {
    raceImg,

    /** Event will be called by CharacterSteps */
    save() {
      const charData = {
        name: this.character.name || "",
        race: this.character.race || ""
      };
      this.message = charData.race ? "" : "Please select a race";
      if (!this.form.validate() || this.message) {
        return;
      }

      if (this.isNew) {
        return this.createCharacter(charData);
      } else {
        // Don't await, so this can work while offline
        this.$store.dispatch("updateCharacter", charData);
      }
    },

    async createCharacter(charData: { name: string; race: string }) {
      try {
        const charId = await this.$store.dispatch("createCharacter", {
          shortBio: randomBio(charData),
          ...charData
        });
        // Manually direct to domains, to avoid a race condition
        this.$router.push({
          name: "character-steps/domains",
          params: { charId }
        });
      } catch (e) {
        this.message = e.message;
      }
      return false; // prevent $router.push
    }
  }
});
</script>

<style scoped>
.rounded {
  border-radius: 8px;
}
</style>
