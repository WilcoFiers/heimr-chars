<template>
  <div>
    <label>
      Name
      <input v-model="name" type="text" />
    </label>
    <button @click="createChar">Create</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "CreateCharacter",
  data() {
    return {
      name: "",
      message: ""
    };
  },
  methods: {
    async createChar() {
      const { name } = this;
      try {
        const result = await this.$store.dispatch("createCharacter", { name });
        console.log("success!", result);
      } catch (e) {
        this.message = e.message;
      }
    }
  }
});
</script>
