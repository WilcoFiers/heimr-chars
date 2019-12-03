<template>
  <OptionsBtn v-bind="$attrs" @click="add('default')">
    <template #default>
      <v-icon left>mdi-plus</v-icon>Add
    </template>

    <template #menu>
      <v-list subheader v-if="items.length > 1">
        <v-list-item-group>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="add(item)"
            >{{ item }}</v-list-item
          >
        </v-list-item-group>
      </v-list>
    </template>
  </OptionsBtn>
</template>

<script lang="ts">
import Vue from "vue";
import OptionsBtn from "@/components/shared/OptionsBtn.vue";

export default Vue.extend({
  name: "AddRuleCardBtn",
  inheritAttrs: false,
  components: { OptionsBtn },
  data() {
    return { items: [] };
  },

  methods: {
    add(e: string) {
      this.$emit("add", e);
    }
  }
});
</script>
