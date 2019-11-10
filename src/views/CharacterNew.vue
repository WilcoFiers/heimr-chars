<template>
  <v-container>
    <v-row class="justify-center">
      <v-col :md="6">
        <v-form class="lg-12">
          <h1>New Characters</h1>
          <v-text-field label="Character name" v-model="name" />
        </v-form>
      </v-col>
    </v-row>
    <HeimrRaces v-model="race" />
    <v-row class="justify-center">
      <v-col :md="6">
        <v-btn @click="saveCharacter">Next: Skills &amp; Conditions</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import HeimrRaces from "@/components/character/HeimrRaces.vue";

export default Vue.extend({
  components: { HeimrRaces },
  data() {
    return {
      name: "",
      race: ""
    };
  },

  methods: {
    saveCharacter() {
      const { name, race } = this;
      console.log({ name, race });
    }
  }
});
</script>

<style scoped>
.form {
  max-width: 500px;
  margin: 3em auto 0;
}
</style>
